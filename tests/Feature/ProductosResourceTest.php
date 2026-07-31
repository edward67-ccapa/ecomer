<?php

namespace Tests\Feature;

use App\Filament\Resources\Categorias\Pages\CreateCategoria;
use App\Filament\Resources\Categorias\Pages\ListCategorias;
use App\Filament\Resources\Productos\Pages\CreateProducto;
use App\Filament\Resources\Productos\Pages\ListProductos;
use App\Models\Categoria;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductosResourceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Site $site;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->user->assignRole(Role::firstOrCreate(['name' => 'super_admin']));
        $this->actingAs($this->user);

        $plantilla = Plantilla::create([
            'slug' => 'ecomer',
            'tipo' => 'ecommerce',
            'nombre' => 'Ecomer',
        ]);

        $dominio = Dominio::create([
            'user_id' => $this->user->id,
            'nombre' => 'creadorDePaginas',
        ]);

        $this->site = Site::create([
            'user_id' => $this->user->id,
            'dominio_id' => $dominio->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'E-comer 1',
            'slug' => 'e-comer1',
            'estado' => 'publicado',
        ]);
    }

    public function test_categoria_pages_render(): void
    {
        Livewire::test(ListCategorias::class)->assertOk();
        Livewire::test(CreateCategoria::class)->assertOk();
    }

    public function test_crear_categoria_con_subcategoria(): void
    {
        Livewire::test(CreateCategoria::class)
            ->fillForm([
                'site_id' => $this->site->id,
                'nombre' => 'Ropa',
                'slug' => 'ropa',
                'activa' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $categoria = Categoria::where('slug', 'ropa')->first();

        $this->assertNotNull($categoria);

        Livewire::test(CreateCategoria::class)
            ->fillForm([
                'site_id' => $this->site->id,
                'parent_id' => $categoria->id,
                'nombre' => 'Camisas',
                'slug' => 'camisas',
                'activa' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $subcategoria = Categoria::where('slug', 'camisas')->first();

        $this->assertNotNull($subcategoria);
        $this->assertSame($categoria->id, $subcategoria->parent_id);
        $this->assertSame($this->site->id, $subcategoria->site_id);
    }

    public function test_producto_pages_render(): void
    {
        Livewire::test(ListProductos::class)->assertOk();
        Livewire::test(CreateProducto::class)->assertOk();
    }

    public function test_crear_producto_con_precio_oferta_y_stock(): void
    {
        $categoria = Categoria::create([
            'site_id' => $this->site->id,
            'nombre' => 'Ropa',
            'slug' => 'ropa',
        ]);

        Livewire::test(CreateProducto::class)
            ->fillForm([
                'site_id' => $this->site->id,
                'categoria_id' => $categoria->id,
                'nombre' => 'Camisa blanca',
                'slug' => 'camisa-blanca',
                'sku' => 'CAM-001',
                'precio' => 250,
                'precio_oferta' => 199.99,
                'cantidad' => '500 g',
                'stock' => 10,
                'activo' => true,
                'destacado' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $producto = Producto::where('slug', 'camisa-blanca')->first();

        $this->assertNotNull($producto);
        $this->assertSame($this->site->id, $producto->site_id);
        $this->assertSame($categoria->id, $producto->categoria_id);
        $this->assertSame('250.00', (string) $producto->precio);
        $this->assertSame('199.99', (string) $producto->precio_oferta);
        $this->assertSame(10, $producto->stock);
        $this->assertSame('CAM-001', $producto->sku);
        $this->assertTrue($producto->activo);
        $this->assertTrue($producto->destacado);
    }
}
