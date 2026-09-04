<?php

namespace Tests\Feature;

use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    private function crearEcosistema(): array
    {
        $user = User::factory()->create();

        $plantilla = Plantilla::create([
            'slug' => 'ecomer',
            'tipo' => 'ecommerce',
            'nombre' => 'Ecomer',
            'estilos' => ['color_primario' => '#f59e0b'],
        ]);

        $inicio = $plantilla->secciones()->create(['slug' => 'inicio', 'nombre' => 'Inicio', 'orden' => 1]);
        $pregunta = $inicio->preguntas()->create(['label' => 'titulo1', 'tipo' => 'texto', 'orden' => 1]);

        $dominio = Dominio::create(['user_id' => $user->id, 'nombre' => 'creadorDePaginas', 'estado' => 'activo']);

        $site = Site::create([
            'user_id' => $user->id,
            'dominio_id' => $dominio->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Mi tienda',
            'slug' => 'e-comer1',
            'estado' => 'publicado',
        ]);

        Respuesta::create(['site_id' => $site->id, 'pregunta_id' => $pregunta->id, 'valor' => 'Hola mundo']);

        return [$plantilla, $site, $dominio];
    }

    public function test_galeria_de_plantillas(): void
    {
        [$plantilla] = $this->crearEcosistema();

        $this->get('/plantillas')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('plantillas/Index')
                ->has('plantillas', 1)
                ->where('plantillas.0.nombre', $plantilla->nombre));
    }

    public function test_publicar_sitio_publico(): void
    {
        [$plantilla, $site, $dominio] = $this->crearEcosistema();

        $this->get("/{$dominio->nombre}/{$site->slug}/inicio")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('sites/Ecomer1/Index')
                ->where('site.nombre', 'Mi tienda')
                ->where('seccionActiva.slug', 'inicio')
                ->where('seccionActiva.contenido.0.valor', 'Hola mundo'));
    }

    public function test_preview_de_plantilla_usa_respuestas_de_plantilla(): void
    {
        [$plantilla, $site] = $this->crearEcosistema();

        $pregunta = $plantilla->secciones()->where('slug', 'inicio')->first()->preguntas()->first();

        Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $pregunta->id,
            'valor' => 'Luciana',
        ]);

        $this->get("/plantillas/{$plantilla->slug}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('sites/Ecomer1/Index')
                ->where('site.nombre', $plantilla->nombre)
                ->where('seccionActiva.slug', 'inicio')
                ->where('seccionActiva.contenido.0.valor', 'Luciana'));

        $this->get("/plantillas/{$plantilla->slug}/inicio")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('sites/Ecomer1/Index')
                ->where('seccionActiva.contenido.0.valor', 'Luciana'));
    }

    public function test_sitio_redirige_a_primera_seccion(): void
    {
        [$plantilla, $site, $dominio] = $this->crearEcosistema();

        $this->get("/{$dominio->nombre}/{$site->slug}")
            ->assertRedirect("/{$dominio->nombre}/{$site->slug}/inicio");
    }

    public function test_sitio_no_publicado_da_404(): void
    {
        [$plantilla, $site, $dominio] = $this->crearEcosistema();
        $site->update(['estado' => 'borrador']);

        $this->get("/{$dominio->nombre}/{$site->slug}/inicio")->assertNotFound();
    }

    public function test_rutas_admin_no_colisionan(): void
    {
        $this->get('/admin/login')->assertOk();
    }

    public function test_storage_fallback_route(): void
    {
        \Illuminate\Support\Facades\Storage::disk('public')->put('sites/test-demo/imagen-test.png', 'test-content');

        // Acceso directo a la nueva ruta ordenada
        $this->get('/storage/sites/test-demo/imagen-test.png')->assertOk();

        // Acceso con ruta antigua no ordenada (búsqueda por nombre de archivo)
        $this->get('/storage/sites/contenido/imagen-test.png')->assertOk();

        \Illuminate\Support\Facades\Storage::disk('public')->delete('sites/test-demo/imagen-test.png');
    }
}
