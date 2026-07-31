<?php

namespace Database\Seeders;

use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Site;
use App\Models\Tienda;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TiendaSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')],
        );

        $dominio = Dominio::firstOrCreate(
            ['nombre' => 'creadorDePaginas'],
            ['user_id' => $user->id, 'estado' => 'activo'],
        );

        $plantillas = Plantilla::orderBy('id')->get();

        $site = Site::firstOrCreate(
            ['slug' => 'demo-site'],
            [
                'user_id' => $user->id,
                'dominio_id' => $dominio->id,
                'plantilla_id' => $plantillas->first()?->id ?? null,
                'nombre' => 'Demo Site',
                'imagen' => null,
                'estado' => 'publicado',
                'estilos' => $plantillas->first()?->estilos ?? [],
            ],
        );

        $ropa = Tienda::firstOrCreate([
            'slug' => 'ropa',
        ], [
            'nombre' => 'Ropa',
            'descripcion' => 'Colección de prendas y accesorios de moda.',
            'estado' => 'activo',
        ]);

        $juguetes = Tienda::firstOrCreate([
            'slug' => 'juguetes',
        ], [
            'nombre' => 'Juguetes',
            'descripcion' => 'Productos para niños y juguetes divertidos.',
            'estado' => 'activo',
        ]);

        if ($plantillas->count() >= 2) {
            $plantillas[0]->tiendas()->syncWithoutDetaching([$ropa->id]);
            $plantillas[1]->tiendas()->syncWithoutDetaching([$ropa->id]);
        }

        if ($plantillas->count() >= 3) {
            $plantillas[2]->tiendas()->syncWithoutDetaching([$juguetes->id]);
        }

        if ($plantillas->count() >= 4) {
            $plantillas[3]->tiendas()->syncWithoutDetaching([$ropa->id, $juguetes->id]);
        }

        $this->seedProductos($ropa, $site, [
            ['nombre' => 'Camiseta Blanca', 'slug' => 'camiseta-blanca', 'precio' => 19.99, 'precio_oferta' => 14.99, 'cantidad' => '1 unidad', 'stock' => 25, 'sku' => 'ROP-001', 'descripcion' => 'Camiseta básica blanca de algodón.', 'activo' => true, 'destacado' => true],
            ['nombre' => 'Pantalón Denim', 'slug' => 'pantalon-denim', 'precio' => 49.99, 'precio_oferta' => null, 'cantidad' => '1 unidad', 'stock' => 10, 'sku' => 'ROP-002', 'descripcion' => 'Pantalón denim clásico.', 'activo' => true, 'destacado' => false],
        ]);

        $this->seedProductos($juguetes, $site, [
            ['nombre' => 'Muñeca de trapo', 'slug' => 'muneca-de-trapo', 'precio' => 24.99, 'precio_oferta' => 19.99, 'cantidad' => '1 unidad', 'stock' => 30, 'sku' => 'JUG-001', 'descripcion' => 'Muñeca suave ideal para niños.', 'activo' => true, 'destacado' => true],
            ['nombre' => 'Set de construcción', 'slug' => 'set-construccion', 'precio' => 34.99, 'precio_oferta' => null, 'cantidad' => '100 piezas', 'stock' => 15, 'sku' => 'JUG-002', 'descripcion' => 'Bloques para construir y crear.', 'activo' => true, 'destacado' => false],
        ]);
    }

    private function seedProductos(Tienda $tienda, Site $site, array $productos): void
    {
        foreach ($productos as $producto) {
            Producto::updateOrCreate(
                [
                    'slug' => $producto['slug'],
                    'site_id' => $site->id,
                ],
                array_merge($producto, [
                    'site_id' => $site->id,
                    'tienda_id' => $tienda->id,
                ]),
            );
        }
    }
}
