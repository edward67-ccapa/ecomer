<?php

namespace Tests\Feature;

use App\Filament\Resources\Colores\Pages\CreateColor;
use App\Filament\Resources\Colores\Pages\ListColores;
use App\Filament\Resources\Plantillas\Pages\CreatePlantilla;
use App\Filament\Resources\Plantillas\Pages\EditPlantilla;
use App\Filament\Resources\Plantillas\Pages\ListPlantillas;
use App\Filament\Resources\Sites\Pages\CreateSite;
use App\Filament\Resources\Sites\Pages\EditSite;
use App\Filament\Resources\Sites\Pages\ListSites;
use App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria;
use App\Filament\Resources\Subcategorias\Pages\ListSubcategorias;
use App\Filament\Resources\Tallas\Pages\CreateTalla;
use App\Filament\Resources\Tallas\Pages\ListTallas;
use App\Models\Categoria;
use App\Models\Color;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Site;
use App\Models\Subcategoria;
use App\Models\Talla;
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

    public function test_create_site_with_plantilla_id_param_renders(): void
    {
        $plantilla = Plantilla::create(['nombre' => 'Test', 'slug' => 'test-plantilla', 'tipo' => 'ecommerce']);
        Livewire::withQueryParams(['plantilla_id' => $plantilla->id])
            ->test(CreateSite::class)
            ->assertOk();
    }

    public function test_subcategoria_color_talla_pages_render(): void
    {
        Livewire::test(ListSubcategorias::class)->assertOk();
        Livewire::test(CreateSubcategoria::class)->assertOk();
        Livewire::test(ListColores::class)->assertOk();
        Livewire::test(CreateColor::class)->assertOk();
        Livewire::test(ListTallas::class)->assertOk();
        Livewire::test(CreateTalla::class)->assertOk();
    }

    public function test_crear_subcategoria(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'tienda',
            'tipo' => 'ecommerce',
            'nombre' => 'Tienda',
        ]);

        $site = Site::create([
            'user_id' => $this->user->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Mi tienda',
            'slug' => 'mi-tienda',
        ]);

        $categoria = Categoria::create([
            'site_id' => $site->id,
            'nombre' => 'Ropa',
            'slug' => 'ropa',
        ]);

        Livewire::test(CreateSubcategoria::class)
            ->fillForm([
                'categoria_id' => $categoria->id,
                'nombre' => 'Remeras',
                'slug' => 'remeras',
                'activa' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertSame('Remeras', Subcategoria::where('slug', 'remeras')->value('nombre'));
    }

    public function test_crear_color_y_talla(): void
    {
        Livewire::test(CreateColor::class)
            ->fillForm([
                'nombre' => 'Azul',
                'slug' => 'azul',
                'hex' => '#3b82f6',
                'activa' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        Livewire::test(CreateTalla::class)
            ->fillForm([
                'nombre' => 'M',
                'slug' => 'm',
                'activa' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertSame('Azul', Color::where('slug', 'azul')->value('nombre'));
        $this->assertSame('M', Talla::where('slug', 'm')->value('nombre'));
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
                            ['label' => 'titulo1', 'tipo' => 'texto', 'estructura' => 'objeto', 'orden' => 1],
                            ['label' => 'portada', 'tipo' => 'imagen', 'estructura' => 'objeto', 'orden' => 2],
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

    public function test_eliminar_pregunta_del_estado_quita_su_campo_respuesta(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'reactiva',
            'tipo' => 'landing_page',
            'nombre' => 'Reactiva',
        ]);

        $seccion = $plantilla->secciones()->create([
            'slug' => 'inicio',
            'nombre' => 'Inicio',
            'orden' => 1,
        ]);

        $mantenida = $seccion->preguntas()->create([
            'label' => 'titulo1',
            'tipo' => 'texto',
            'orden' => 1,
        ]);

        $eliminada = $seccion->preguntas()->create([
            'label' => 'titulo2',
            'tipo' => 'texto',
            'orden' => 2,
        ]);

        Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
            ->fillForm([
                'secciones' => [
                    [
                        'id' => $seccion->id,
                        'nombre' => 'Inicio',
                        'slug' => 'inicio',
                        'preguntas' => [
                            ['id' => $mantenida->id, 'label' => 'titulo1', 'tipo' => 'texto'],
                        ],
                    ],
                ],
            ])
            ->assertFormFieldExists('respuestas.'.$mantenida->id.'.valor');
    }

    public function test_enlace_de_respuesta_se_guarda(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'con-enlace',
            'tipo' => 'landing_page',
            'nombre' => 'Con enlace',
        ]);

        $seccion = $plantilla->secciones()->create([
            'slug' => 'inicio',
            'nombre' => 'Inicio',
            'orden' => 1,
        ]);

        $pregunta = $seccion->preguntas()->create([
            'label' => 'boton',
            'tipo' => 'texto',
            'orden' => 1,
        ]);

        Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
            ->fillForm([
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Ver productos', 'enlace' => 'https://ejemplo.com/productos'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $respuesta = Respuesta::where('plantilla_id', $plantilla->id)
            ->where('pregunta_id', $pregunta->id)
            ->first();

        $this->assertNotNull($respuesta);
        $this->assertSame('Ver productos', $respuesta->valor);
        $this->assertSame('https://ejemplo.com/productos', $respuesta->enlace);
    }

    public function test_nueva_pregunta_aparece_en_respuestas_despues_de_guardar(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'con-nueva',
            'tipo' => 'landing_page',
            'nombre' => 'Con nueva',
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
        ]);

        $component = Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()]);

        $component
            ->fillForm([
                'secciones' => [
                    'record-'.$seccion->id => [
                        'id' => $seccion->id,
                        'nombre' => 'Inicio',
                        'slug' => 'inicio',
                        'orden' => 1,
                        'activa' => true,
                        'preguntas' => [
                            'record-'.$pregunta->id => ['id' => $pregunta->id, 'label' => 'titulo1', 'tipo' => 'texto', 'estructura' => 'objeto', 'orden' => 1],
                            ['label' => 'nueva_pregunta', 'tipo' => 'texto', 'estructura' => 'objeto', 'orden' => 2],
                        ],
                    ],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $preguntaNueva = $seccion->refresh()->preguntas()->where('label', 'nueva_pregunta')->first();

        $this->assertNotNull($preguntaNueva);

        Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
            ->assertFormFieldExists('respuestas.'.$preguntaNueva->id.'.valor');
    }

    public function test_site_pages_render(): void
    {
        Livewire::test(ListSites::class)->assertOk();
        Livewire::test(CreateSite::class)->assertOk();
    }

    public function test_editar_plantilla_guarda_respuestas(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'editable',
            'tipo' => 'landing_page',
            'nombre' => 'Editable',
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
        ]);

        Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
            ->fillForm([
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Contenido de plantilla'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $respuesta = Respuesta::where('plantilla_id', $plantilla->id)
            ->where('pregunta_id', $pregunta->id)
            ->first();

        $this->assertNotNull($respuesta);
        $this->assertNull($respuesta->site_id);
        $this->assertSame('Contenido de plantilla', $respuesta->valor);
    }

    public function test_crear_site_copia_respuestas_de_plantilla(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'copia',
            'tipo' => 'landing_page',
            'nombre' => 'Copia',
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
        ]);

        Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $pregunta->id,
            'valor' => 'Contenido de plantilla',
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
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $site = Site::where('slug', 'mi-tienda')->first();

        $this->assertNotNull($site);
        $this->assertSame(
            'Contenido de plantilla',
            Respuesta::where('site_id', $site->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );
        $this->assertSame(
            'Contenido de plantilla',
            Respuesta::where('plantilla_id', $plantilla->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );
    }

    public function test_respuestas_de_plantilla_y_site_son_independientes(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'independiente',
            'tipo' => 'landing_page',
            'nombre' => 'Independiente',
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
        ]);

        $site = Site::create([
            'user_id' => $this->user->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Site A',
            'slug' => 'site-a',
        ]);

        Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $pregunta->id,
            'valor' => 'Valor plantilla',
        ]);

        Respuesta::create([
            'site_id' => $site->id,
            'pregunta_id' => $pregunta->id,
            'valor' => 'Valor sitio',
        ]);

        Livewire::test(EditSite::class, ['record' => $site->getRouteKey()])
            ->fillForm([
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Valor sitio editado'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame(
            'Valor sitio editado',
            Respuesta::where('site_id', $site->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );
        $this->assertSame(
            'Valor plantilla',
            Respuesta::where('plantilla_id', $plantilla->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );

        Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
            ->fillForm([
                'respuestas' => [
                    $pregunta->id => ['valor' => 'Valor plantilla editado'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame(
            'Valor sitio editado',
            Respuesta::where('site_id', $site->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );
        $this->assertSame(
            'Valor plantilla editado',
            Respuesta::where('plantilla_id', $plantilla->id)->where('pregunta_id', $pregunta->id)->value('valor'),
        );
    }

    public function test_crear_site_desde_plantilla_queda_publicado(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'ecomer',
            'tipo' => 'ecommerce',
            'nombre' => 'Ecomer',
        ]);

        $dominio = Dominio::create([
            'user_id' => $this->user->id,
            'nombre' => 'creadorDePaginas',
        ]);

        Livewire::withQueryParams(['plantilla_id' => (string) $plantilla->id])
            ->test(CreateSite::class)
            ->assertFormSet([
                'plantilla_id' => $plantilla->id,
                'estado' => 'publicado',
                'dominio_id' => $dominio->id,
            ]);
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

    public function test_preguntas_se_reordenan_por_orden_al_escribir(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'con-orden',
            'tipo' => 'landing_page',
            'nombre' => 'Con orden',
        ]);

        $seccion = $plantilla->secciones()->create([
            'slug' => 'inicio',
            'nombre' => 'Inicio',
            'orden' => 1,
        ]);

        $preguntas = collect();
        foreach (['portada', 'titulo1', 'subtitulo', 'boton'] as $i => $label) {
            $preguntas->push($seccion->preguntas()->create([
                'label' => $label,
                'tipo' => 'texto',
                'orden' => $i + 1,
            ]));
        }

        $existing = $preguntas->mapWithKeys(fn ($q): array => ['record-'.$q->id => [
            'id' => $q->id,
            'label' => $q->label,
            'tipo' => 'texto',
            'estructura' => 'objeto',
            'orden' => $q->orden,
        ]])->all();

        $component = Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()]);

        $component
            ->fillForm([
                'secciones' => [
                    'record-'.$seccion->id => [
                        'id' => $seccion->id,
                        'nombre' => 'Inicio',
                        'slug' => 'inicio',
                        'orden' => 1,
                        'activa' => true,
                        'preguntas' => $existing + [
                            ['label' => 'nueva', 'tipo' => 'texto', 'estructura' => 'objeto', 'orden' => 5],
                        ],
                    ],
                ],
            ]);

        $this->assertTrue(true);
    }
}
