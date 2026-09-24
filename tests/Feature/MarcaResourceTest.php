<?php

namespace Tests\Feature;

use App\Http\Resources\v1\ProductoResource;
use App\Models\Dominio;
use App\Models\Marca;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarcaResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_marca_y_asignar_a_producto(): void
    {
        $user = User::factory()->create();
        $dominio = Dominio::create(['nombre' => 'midominio.com', 'user_id' => $user->id]);
        $plantilla = Plantilla::create(['nombre' => 'Plantilla Test', 'slug' => 'plantilla-test', 'tipo' => 'ecommerce']);
        $site = Site::create([
            'user_id' => $user->id,
            'dominio_id' => $dominio->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Sitio Test',
            'slug' => 'sitio-test',
        ]);

        $marca = Marca::create([
            'titulo' => 'Nike',
            'slug' => 'nike',
            'imagen' => 'marcas/nike.png',
            'descripcion' => 'Marca de ropa deportiva',
        ]);

        $this->assertEquals('Nike', $marca->nombre);

        $producto = Producto::create([
            'site_id' => $site->id,
            'marca_id' => $marca->id,
            'nombre' => 'Zapatillas Air Max',
            'slug' => 'zapatillas-air-max',
            'precio' => 299.90,
        ]);

        $this->assertNotNull($producto->marca);
        $this->assertEquals('Nike', $producto->marca->titulo);

        $resourceArray = (new ProductoResource($producto->fresh(['marca'])))->toArray(request());
        $this->assertEquals('Nike', $resourceArray['marca']);
        $this->assertEquals($marca->id, $resourceArray['marca_id']);
        $this->assertNotNull($resourceArray['marca_objeto']);
        $this->assertEquals('Nike', $resourceArray['marca_objeto']['titulo']);
    }

    public function test_puede_asignar_marcas_a_sitios_y_plantillas(): void
    {
        $user = User::factory()->create();
        $dominio = Dominio::create(['nombre' => 'midominio.com', 'user_id' => $user->id]);
        $plantilla = Plantilla::create(['nombre' => 'Plantilla Test', 'slug' => 'plantilla-test', 'tipo' => 'ecommerce']);
        $site = Site::create([
            'user_id' => $user->id,
            'dominio_id' => $dominio->id,
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Sitio Test',
            'slug' => 'sitio-test',
        ]);

        $marca1 = Marca::create(['titulo' => 'Adidas', 'slug' => 'adidas']);
        $marca2 = Marca::create(['titulo' => 'Puma', 'slug' => 'puma']);

        $plantilla->marcas()->attach([$marca1->id, $marca2->id]);
        $site->marcas()->attach([$marca1->id]);

        $this->assertCount(2, $plantilla->fresh()->marcas);
        $this->assertCount(1, $site->fresh()->marcas);
    }
}
