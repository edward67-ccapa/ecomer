<?php

namespace Database\Seeders;

use App\Models\Color;
use App\Models\Talla;
use Illuminate\Database\Seeder;

class ColoresTallasSeeder extends Seeder
{
    public function run(): void
    {
        $colores = [
            ['nombre' => 'Blanco', 'slug' => 'blanco', 'hex' => '#ffffff'],
            ['nombre' => 'Negro', 'slug' => 'negro', 'hex' => '#000000'],
            ['nombre' => 'Gris', 'slug' => 'gris', 'hex' => '#808080'],
            ['nombre' => 'Rojo', 'slug' => 'rojo', 'hex' => '#ef4444'],
            ['nombre' => 'Azul', 'slug' => 'azul', 'hex' => '#3b82f6'],
            ['nombre' => 'Verde', 'slug' => 'verde', 'hex' => '#22c55e'],
            ['nombre' => 'Amarillo', 'slug' => 'amarillo', 'hex' => '#eab308'],
            ['nombre' => 'Rosa', 'slug' => 'rosa', 'hex' => '#ec4899'],
            ['nombre' => 'Naranja', 'slug' => 'naranja', 'hex' => '#f97316'],
            ['nombre' => 'Marrón', 'slug' => 'marron', 'hex' => '#92400e'],
            ['nombre' => 'Celeste', 'slug' => 'celeste', 'hex' => '#7dd3fc'],
            ['nombre' => 'Beige', 'slug' => 'beige', 'hex' => '#f5f5dc'],
        ];

        foreach ($colores as $i => $color) {
            Color::updateOrCreate(
                ['slug' => $color['slug']],
                $color + ['orden' => $i],
            );
        }

        $tallas = [
            'XS', 'S', 'M', 'L', 'XL', 'XXL',
        ];

        foreach ($tallas as $i => $talla) {
            Talla::updateOrCreate(
                ['slug' => strtolower($talla)],
                ['nombre' => $talla, 'orden' => $i],
            );
        }
    }
}
