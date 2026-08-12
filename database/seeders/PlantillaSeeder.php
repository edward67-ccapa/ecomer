<?php

namespace Database\Seeders;

use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Seccion;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlantillaSeeder extends Seeder
{
    /**
     * Seed the application's plantillas, dominios and demo sites.
     */
    public function run(): void
    {
        $ecomer = Plantilla::updateOrCreate(
            ['slug' => 'ecomer'],
            [
                'tipo' => 'ecommerce',
                'nombre' => 'Ecomer',
                'descripcion' => 'Tienda online completa con inicio, nosotros, productos y contacto.',
                'estilos' => [
                    'color_primario' => '#f59e0b',
                    'color_secundario' => '#1f2937',
                    'tipografia_titulos' => 'Inter',
                    'tipografia_texto' => 'Inter',
                    'radio_bordes' => '0.5rem',
                    'espaciado' => '1rem',
                ],
                'activa' => true,
            ]
        );

        $ecomer->secciones()->delete();
        $ecomer->secciones()->createMany([
            $this->seccion('inicio', 'Inicio', 1),
            $this->seccion('nosotros', 'Nosotros', 2),
            $this->seccion('productos', 'Productos', 3),
            $this->seccion('contacto', 'Contacto', 4),
        ]);

        $this->preguntas($ecomer->secciones[0], [
            ['label' => 'portada', 'tipo' => 'imagen', 'orden' => 1, 'requerida' => true, 'ayuda' => 'Imagen principal del hero'],
            ['label' => 'titulo1', 'tipo' => 'texto', 'orden' => 2, 'requerida' => true],
            ['label' => 'subtitulo', 'tipo' => 'area', 'orden' => 3],
            ['label' => 'boton', 'tipo' => 'texto', 'orden' => 4],
        ]);

        $this->preguntas($ecomer->secciones[1], [
            ['label' => 'titulo', 'tipo' => 'texto', 'orden' => 1, 'requerida' => true],
            ['label' => 'descripcion', 'tipo' => 'area', 'orden' => 2],
            ['label' => 'foto', 'tipo' => 'imagen', 'orden' => 3],
        ]);

        $this->preguntas($ecomer->secciones[2], [
            ['label' => 'titulo', 'tipo' => 'texto', 'orden' => 1, 'requerida' => true],
            ['label' => 'galeria', 'tipo' => 'galeria', 'orden' => 2],
        ]);

        $this->preguntas($ecomer->secciones[3], [
            ['label' => 'titulo', 'tipo' => 'texto', 'orden' => 1],
            ['label' => 'direccion', 'tipo' => 'texto', 'orden' => 2],
            ['label' => 'telefono', 'tipo' => 'texto', 'orden' => 3],
            ['label' => 'whatsapp', 'tipo' => 'texto', 'orden' => 4],
            ['label' => 'color_fondo', 'tipo' => 'color', 'orden' => 5],
        ]);

        $landing = Plantilla::updateOrCreate(
            ['slug' => 'landing-page'],
            [
                'tipo' => 'landing_page',
                'nombre' => 'Landing Page',
                'descripcion' => 'Página de aterrizaje minimalista con sección hero y contacto.',
                'estilos' => [
                    'color_primario' => '#3b82f6',
                    'color_secundario' => '#111827',
                    'tipografia_titulos' => 'Inter',
                    'tipografia_texto' => 'Inter',
                    'radio_bordes' => '0.25rem',
                    'espaciado' => '0.75rem',
                ],
                'activa' => true,
            ]
        );

        $landing->secciones()->delete();
        $landing->secciones()->createMany([
            $this->seccion('inicio', 'Inicio', 1),
            $this->seccion('contacto', 'Contacto', 2),
        ]);

        $this->preguntas($landing->secciones[0], [
            ['label' => 'portada', 'tipo' => 'imagen', 'orden' => 1, 'requerida' => true],
            ['label' => 'titulo1', 'tipo' => 'texto', 'orden' => 2, 'requerida' => true],
            ['label' => 'subtitulo', 'tipo' => 'area', 'orden' => 3],
            ['label' => 'boton', 'tipo' => 'texto', 'orden' => 4],
        ]);

        $this->preguntas($landing->secciones[1], [
            ['label' => 'titulo', 'tipo' => 'texto', 'orden' => 1],
            ['label' => 'telefono', 'tipo' => 'texto', 'orden' => 2],
            ['label' => 'whatsapp', 'tipo' => 'texto', 'orden' => 3],
        ]);

        $anuncio = Plantilla::updateOrCreate(
            ['slug' => 'anuncio-promocional'],
            [
                'tipo' => 'anuncio',
                'nombre' => 'Anuncio Promocional',
                'descripcion' => 'Plantilla de alta conversión para ofertas especiales, lanzamientos y anuncios express.',
                'estilos' => [
                    'color_primario' => '#dc2626',
                    'color_secundario' => '#0f172a',
                    'tipografia_titulos' => 'Inter',
                    'tipografia_texto' => 'Inter',
                    'radio_bordes' => '0.75rem',
                    'espaciado' => '1.25rem',
                ],
                'activa' => true,
            ]
        );

        $anuncio->secciones()->delete();
        $anuncio->secciones()->createMany([
            $this->seccion('oferta', 'Oferta Flash', 1),
            $this->seccion('detalles', 'Detalles', 2),
        ]);

        $this->preguntas($anuncio->secciones[0], [
            ['label' => 'aviso_superior', 'tipo' => 'texto', 'orden' => 1, 'ayuda' => 'Ej: ¡OFERTA POR TIEMPO LIMITADO! - 50% DCTO'],
            ['label' => 'titulo_principal', 'tipo' => 'texto', 'orden' => 2, 'requerida' => true],
            ['label' => 'subtitulo', 'tipo' => 'area', 'orden' => 3],
            ['label' => 'portada', 'tipo' => 'imagen', 'orden' => 4],
            ['label' => 'precio_oferta', 'tipo' => 'texto', 'orden' => 5],
            ['label' => 'precio_normal', 'tipo' => 'texto', 'orden' => 6],
            ['label' => 'boton_cta', 'tipo' => 'texto', 'orden' => 7],
        ]);

        $this->preguntas($anuncio->secciones[1], [
            ['label' => 'titulo_detalles', 'tipo' => 'texto', 'orden' => 1],
            ['label' => 'beneficios', 'tipo' => 'area', 'orden' => 2],
            ['label' => 'whatsapp', 'tipo' => 'texto', 'orden' => 3],
        ]);

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')],
        );

        $dominio = Dominio::firstOrCreate(
            ['nombre' => 'creadorDePaginas'],
            ['user_id' => $user->id, 'estado' => 'activo']
        );

        $site = Site::updateOrCreate(
            ['slug' => 'e-comer1'],
            [
                'user_id' => $user->id,
                'dominio_id' => $dominio->id,
                'plantilla_id' => $ecomer->id,
                'nombre' => 'E-comer 1',
                'estado' => 'publicado',
                'estilos' => $ecomer->estilos,
            ]
        );

        $respuestas = [
            'titulo1' => 'Bienvenido a mi tienda',
            'subtitulo' => 'Productos de calidad al mejor precio.',
            'boton' => ['valor' => 'Ver productos', 'enlace' => 'https://ejemplo.com/productos'],
            'titulo' => 'Sobre nosotros',
            'descripcion' => 'Somos una tienda familiar con más de 10 años de experiencia.',
            'direccion' => 'Av. Principal 123',
            'telefono' => '+51 999 888 777',
            'whatsapp' => ['valor' => 'WhatsApp', 'enlace' => 'https://wa.me/51999888777'],
            'color_fondo' => '#f3f4f6',
        ];

        foreach ($ecomer->secciones as $seccion) {
            foreach ($seccion->preguntas as $pregunta) {
                $label = Str::slug($pregunta->label);

                if (! array_key_exists($label, $respuestas)) {
                    continue;
                }

                $valor = is_array($respuestas[$label])
                    ? $respuestas[$label]['valor']
                    : $respuestas[$label];

                $enlace = is_array($respuestas[$label])
                    ? ($respuestas[$label]['enlace'] ?? null)
                    : null;

                Respuesta::updateOrCreate(
                    ['site_id' => $site->id, 'pregunta_id' => $pregunta->id],
                    ['valor' => $valor, 'enlace' => $enlace],
                );
            }
        }
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function seccion(string $slug, string $nombre, int $orden): array
    {
        return ['slug' => $slug, 'nombre' => $nombre, 'orden' => $orden];
    }

    /**
     * @param  array<int, array<string, mixed>>  $preguntas
     */
    private function preguntas(Seccion $seccion, array $preguntas): void
    {
        $seccion->preguntas()->createMany($preguntas);
    }
}
