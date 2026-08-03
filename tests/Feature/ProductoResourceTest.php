<?php

namespace Tests\Feature;

use App\Filament\Resources\Categorias\Pages\EditCategoria;
use App\Filament\Resources\Categorias\RelationManagers\SubcategoriasRelationManager;
use App\Filament\Resources\Productos\Pages\CreateProducto;
use App\Filament\Resources\Productos\Pages\ListProductos;
use App\Models\Categoria;
use App\Models\Color;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Site;
use App\Models\Subcategoria;
use App\Models\Talla;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductoResourceTest extends TestCase
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

    public function test_producto_pages_render(): void
    {
        Livewire::test(ListProductos::class)->assertOk();
        Livewire::test(CreateProducto::class)->assertOk();
    }

    public function test_crear_producto_con_subcategoria_y_variantes(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'ecommerce',
            'tipo' => 'ecommerce',
            'nombre' => 'Ecommerce',
        ]);

        $site = Site::create([
            'user_id' => $this->user->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Mi tienda',
            'slug' => 'mi-tienda',
        ]);

        $zapatilla = Categoria::create([
            'site_id' => $site->id,
            'nombre' => 'Zapatilla',
            'slug' => 'zapatilla',
        ]);

        $nike = Subcategoria::create([
            'categoria_id' => $zapatilla->id,
            'nombre' => 'Nike',
            'slug' => 'nike',
        ]);

        $rojo = Color::create([
            'nombre' => 'Rojo',
            'slug' => 'rojo',
        ]);

        $xl = Talla::create([
            'nombre' => 'XL',
            'slug' => 'xl',
        ]);

        Livewire::test(CreateProducto::class)
            ->fillForm([
                'site_id' => $site->id,
                'categoria_id' => $zapatilla->id,
                'subcategoria_id' => $nike->id,
                'nombre' => 'Zapatilla Running',
                'slug' => 'zapatilla-running',
                'precio' => 89.99,
                'stock' => 10,
                'variantes' => [
                    [
                        'color_id' => $rojo->id,
                        'talla_id' => $xl->id,
                        'nombre' => 'Rojo XL',
                        'slug' => 'rojo-xl',
                        'precio' => 95,
                        'stock' => 5,
                        'activa' => true,
                    ],
                ],
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $producto = Producto::where('slug', 'zapatilla-running')->first();

        $this->assertNotNull($producto);
        $this->assertSame($zapatilla->id, $producto->categoria_id);
        $this->assertSame($nike->id, $producto->subcategoria_id);

        $this->assertCount(1, $producto->variantes);

        $variante = $producto->variantes->first();
        $this->assertSame($rojo->id, $variante->color_id);
        $this->assertSame($xl->id, $variante->talla_id);
        $this->assertSame('Rojo', $variante->color->nombre);
        $this->assertSame('XL', $variante->talla->nombre);
        $this->assertSame('Rojo XL', $variante->nombre);
        $this->assertSame('rojo-xl', $variante->slug);
        $this->assertSame('95.00', $variante->precio);
        $this->assertSame(5, $variante->stock);
    }

    public function test_crear_subcategoria_desde_la_categoria(): void
    {
        $plantilla = Plantilla::create([
            'slug' => 'ecommerce',
            'tipo' => 'ecommerce',
            'nombre' => 'Ecommerce',
        ]);

        $site = Site::create([
            'user_id' => $this->user->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Mi tienda',
            'slug' => 'mi-tienda',
        ]);

        $zapatilla = Categoria::create([
            'site_id' => $site->id,
            'nombre' => 'Zapatilla',
            'slug' => 'zapatilla',
        ]);

        Livewire::test(EditCategoria::class, ['record' => $zapatilla->getRouteKey()])
            ->assertOk();

        Livewire::test(SubcategoriasRelationManager::class, [
            'ownerRecord' => $zapatilla,
            'pageClass' => EditCategoria::class,
        ])
            ->callTableAction('create', data: [
                'nombre' => 'Nike',
                'slug' => 'nike',
            ])
            ->assertHasNoTableActionErrors();

        $this->assertSame('Nike', $zapatilla->subcategorias()->first()?->nombre);
        $this->assertSame('nike', $zapatilla->subcategorias()->first()?->slug);
    }
}
