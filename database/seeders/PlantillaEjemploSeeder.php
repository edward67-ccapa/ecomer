<?php

namespace Database\Seeders;

use App\Models\Plantilla;
use App\Models\Pregunta;
use App\Models\Respuesta;
use App\Models\Seccion;
use Illuminate\Database\Seeder;

class PlantillaEjemploSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear la Plantilla
        $plantilla = Plantilla::updateOrCreate(
            ['slug' => 'plantilla-corporativa'],
            [
                'nombre' => 'Plantilla Corporativa',
                'tipo' => 'landing_page',
                'activa' => true,
                'descripcion' => 'Plantilla de ejemplo para mostrar la estructura de grupos y arrays.',
                'estilos' => [
                    'color_primario' => '#000000',
                    'color_secundario' => '#ffffff',
                ],
            ]
        );

        // 2. Crear una Sección principal
        $seccionNosotros = Seccion::updateOrCreate(
            [
                'plantilla_id' => $plantilla->id,
                'slug' => 'seccion-nosotros',
            ],
            [
                'nombre' => 'Sección Nosotros',
                'orden' => 1,
                'activa' => true,
            ]
        );

        // 3. Crear Pregunta: Título Principal (Objeto simple)
        $pTitulo = Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'label' => 'titulo_principal',
            ],
            [
                'tipo' => 'texto',
                'estructura' => 'objeto',
                'max_items' => 1,
                'orden' => 1,
                'requerida' => true,
            ]
        );

        // 4. Crear Pregunta: Logo Empresa (Objeto simple)
        $pLogo = Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'label' => 'logo_empresa',
            ],
            [
                'tipo' => 'imagen',
                'estructura' => 'objeto',
                'max_items' => 1,
                'orden' => 2,
                'requerida' => false,
            ]
        );

        // 5. Crear Pregunta: Galería Oficina (Array de imágenes)
        $pGaleria = Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'label' => 'galeria_oficina',
            ],
            [
                'tipo' => 'imagen',
                'estructura' => 'array',
                'max_items' => 5,
                'orden' => 3,
                'requerida' => false,
            ]
        );

        // 6. Crear Pregunta PADRE: Miembros del Equipo (Grupo, Array)
        $grupoEquipo = Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'label' => 'miembros_equipo',
            ],
            [
                'tipo' => 'grupo',
                'estructura' => 'array',
                'max_items' => 3,
                'orden' => 4,
                'requerida' => true,
            ]
        );

        // 7. Crear Preguntas HIJAS para el Grupo "Miembros del Equipo"
        Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'parent_id' => $grupoEquipo->id,
                'label' => 'nombre',
            ],
            [
                'tipo' => 'texto',
                'estructura' => 'objeto',
                'orden' => 1,
            ]
        );

        Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'parent_id' => $grupoEquipo->id,
                'label' => 'cargo',
            ],
            [
                'tipo' => 'texto',
                'estructura' => 'objeto',
                'orden' => 2,
            ]
        );

        Pregunta::updateOrCreate(
            [
                'seccion_id' => $seccionNosotros->id,
                'parent_id' => $grupoEquipo->id,
                'label' => 'foto',
            ],
            [
                'tipo' => 'imagen',
                'estructura' => 'objeto',
                'orden' => 3,
            ]
        );

        // 8. Crear Respuestas de Ejemplo de la Plantilla
        Respuesta::updateOrCreate(
            [
                'plantilla_id' => $plantilla->id,
                'pregunta_id' => $pTitulo->id,
            ],
            [
                'valor' => 'Conoce a nuestra empresa',
            ]
        );

        Respuesta::updateOrCreate(
            [
                'plantilla_id' => $plantilla->id,
                'pregunta_id' => $pLogo->id,
            ],
            [
                'valor' => 'logo.png',
            ]
        );

        Respuesta::updateOrCreate(
            [
                'plantilla_id' => $plantilla->id,
                'pregunta_id' => $pGaleria->id,
            ],
            [
                'valor' => json_encode(['oficina1.jpg', 'oficina2.jpg']),
            ]
        );

        Respuesta::updateOrCreate(
            [
                'plantilla_id' => $plantilla->id,
                'pregunta_id' => $grupoEquipo->id,
            ],
            [
                'valor' => json_encode([
                    [
                        'nombre' => 'Juan Perez',
                        'cargo' => 'Gerente',
                        'foto' => 'juan.jpg',
                    ],
                    [
                        'nombre' => 'Ana Lopez',
                        'cargo' => 'Diseñadora',
                        'foto' => 'ana.jpg',
                    ],
                ]),
            ]
        );

        // 9. Crear Usuario, Dominio y Site de Ejemplo (Corporativo 1)
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        $dominio = \App\Models\Dominio::firstOrCreate(
            ['nombre' => 'creadorDePaginas'],
            ['user_id' => $user->id, 'estado' => 'activo']
        );

        $site = \App\Models\Site::updateOrCreate(
            ['slug' => 'corporativo1'],
            [
                'user_id' => $user->id,
                'dominio_id' => $dominio->id,
                'plantilla_id' => $plantilla->id,
                'nombre' => 'Corporativo 1',
                'estado' => 'publicado',
                'estilos' => $plantilla->estilos,
            ]
        );

        // 10. Crear Respuestas del Site de Ejemplo
        Respuesta::updateOrCreate(
            ['site_id' => $site->id, 'pregunta_id' => $pTitulo->id],
            ['valor' => 'Conoce a nuestra empresa']
        );

        Respuesta::updateOrCreate(
            ['site_id' => $site->id, 'pregunta_id' => $pLogo->id],
            ['valor' => 'logo.png']
        );

        Respuesta::updateOrCreate(
            ['site_id' => $site->id, 'pregunta_id' => $pGaleria->id],
            ['valor' => json_encode(['oficina1.jpg', 'oficina2.jpg'])]
        );

        Respuesta::updateOrCreate(
            ['site_id' => $site->id, 'pregunta_id' => $grupoEquipo->id],
            [
                'valor' => json_encode([
                    [
                        'nombre' => 'Juan Perez',
                        'cargo' => 'Gerente',
                        'foto' => 'juan.jpg',
                    ],
                    [
                        'nombre' => 'Ana Lopez',
                        'cargo' => 'Diseñadora',
                        'foto' => 'ana.jpg',
                    ],
                ]),
            ]
        );
    }
}
