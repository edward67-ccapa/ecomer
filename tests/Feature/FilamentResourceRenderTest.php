<?php

namespace Tests\Feature;

use App\Filament\Resources\Plantillas\Pages\CreatePlantilla;
use App\Filament\Resources\Plantillas\Pages\ListPlantillas;
use App\Filament\Resources\Sites\Pages\CreateSite;
use App\Filament\Resources\Sites\Pages\EditSite;
use App\Filament\Resources\Sites\Pages\ListSites;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FilamentResourceRenderTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->user->assignRole(Role::firstOrCreate(['name' => 'super_admin']));
        $this->actingAs($this->user);
    }

    public function test_plantilla_pages_render(): void
    {
        Livewire::test(ListPlantillas::class)->assertOk();
        Livewire::test(CreatePlantilla::class)->assertOk();
    }

    public function test_crear_plantilla_con_secciones_y_preguntas(): void
    {
        Livewire::test(CreatePlantilla::class)
            ->fillForm([
                'nombre' => 'Tienda Minimal',
                'slug' => 'tienda-minimal',
                'tipo' => 'ecommerce',
                'activa' => true,
                'estilos' => ['color_primario' => '#000000'],
                'secciones' => [
                    [
                        'nombre' => 'Inicio',
                        'slug' => 'inicio',
                        'orden' => 1,
                        'activa' => true,
                        'preguntas' => [
                            ['label' => 'titulo1', 'tipo' => 'texto', 'orden' => 1],
                            ['label' => 'portada', 'tipo' => 'imagen', 'orden' => 2],
                        ],
                    ],
                ],
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $plantilla = Plantilla::where('slug', 'tienda-minimal')->first();

        $this->assertNotNull($plantilla);
        $this->assertCount(1, $plantilla->secciones);
        $this->assertCount(2, $plantilla->secciones->first()->preguntas);
        $this->assertSame(['color_primario' => '#000000'], $plantilla->estilos);
    }

    public function test_site_pages_render(): void
    {
        Livewire::test(ListSites::class)->assertOk();
        Livewire::test(CreateSite::class)->assertOk();
    }

    public function test_crear_site_con_respuestas(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'minimal',
            'tipo' => 'landing_page',
            'nombre' => 'Minimal',
            'estilos' => ['color_primario' => '#3b82f6'],
        ]);

        $seccion = $plantilla->secciones()->create([
            'slug' => 'inicio',
            'nombre' => 'Inicio',
            'orden' => 1,
        ]);

        $pregunta = $seccion->preguntas()->create([
            'label' => 'titulo1',
            'tipo' => 'texto',
            'orden' => 1,
            'requerida' => true,
        ]);

        $dominio = Dominio::create([
            'user_id' => $this->user->id,
            'nombre' => 'creadorDePaginas',
        ]);

        Livewire::test(CreateSite::class)
            ->fillForm([
                'user_id' => $this->user->id,
                'plantilla_id' => $plantilla->id,
                'dominio_id' => $dominio->id,
                'nombre' => 'Mi tienda',
                'slug' => 'mi-tienda',
                'estado' => 'publicado',
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Mi titulo'],
                ],
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $site = Site::where('slug', 'mi-tienda')->first();

        $this->assertNotNull($site);
        $this->assertSame($plantilla->id, $site->plantilla_id);
        $this->assertSame(['color_primario' => '#3b82f6'], $site->estilos);

        $respuesta = Respuesta::where('site_id', $site->id)->where('pregunta_id', $pregunta->id)->first();
        $this->assertNotNull($respuesta);
        $this->assertSame('Mi titulo', $respuesta->valor);
    }

    public function test_editar_site_actualiza_respuestas(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'minimal',
            'tipo' => 'landing_page',
            'nombre' => 'Minimal',
        ]);

        $seccion = $plantilla->secciones()->create([
            'slug' => 'inicio',
            'nombre' => 'Inicio',
            'orden' => 1,
        ]);

        $pregunta = $seccion->preguntas()->create([
            'label' => 'titulo1',
            'tipo' => 'texto',
            'orden' => 1,
            'requerida' => true,
        ]);

        $site = Site::create([
            'user_id' => $this->user->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Mi tienda',
            'slug' => 'mi-tienda',
        ]);

        Respuesta::create([
            'site_id' => $site->id,
            'pregunta_id' => $pregunta->id,
            'valor' => 'Original',
        ]);

        Livewire::test(EditSite::class, ['record' => $site->getRouteKey()])
            ->fillForm([
                'nombre' => 'Mi tienda editada',
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Editado'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('Mi tienda editada', $site->refresh()->nombre);
        $this->assertSame('Editado', Respuesta::where('site_id', $site->id)->where('pregunta_id', $pregunta->id)->value('valor'));
    }
}
