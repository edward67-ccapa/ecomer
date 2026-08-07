<?php

namespace Database\Seeders;

use App\Models\Plantilla;
use App\Models\Pregunta;
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
        $plantilla = Plantilla::create([
            'nombre' => 'Plantilla Corporativa',
            'slug' => 'plantilla-corporativa',
            'tipo' => 'landing_page',
            'activa' => true,
            'descripcion' => 'Plantilla de ejemplo para mostrar la estructura de grupos y arrays.',
            'estilos' => [
                'color_primario' => '#000000',
                'color_secundario' => '#ffffff',
            ],
        ]);

        // 2. Crear una Sección principal
        $seccionNosotros = Seccion::create([
            'plantilla_id' => $plantilla->id,
            'nombre' => 'Sección Nosotros',
            'slug' => 'seccion-nosotros',
            'orden' => 1,
            'activa' => true,
        ]);

        // 3. Crear Pregunta: Título Principal (Objeto simple)
        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'label' => 'titulo_principal',
            'tipo' => 'texto',
            'estructura' => 'objeto',
            'orden' => 1,
            'requerida' => true,
        ]);

        // 4. Crear Pregunta: Logo Empresa (Objeto simple)
        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'label' => 'logo_empresa',
            'tipo' => 'imagen',
            'estructura' => 'objeto',
            'orden' => 2,
            'requerida' => false,
        ]);

        // 5. Crear Pregunta: Galería Oficina (Array de imágenes)
        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'label' => 'galeria_oficina',
            'tipo' => 'imagen',
            'estructura' => 'array',
            'max_items' => 5, // Límite de 5 fotos
            'orden' => 3,
            'requerida' => false,
        ]);

        // 6. Crear Pregunta PADRE: Miembros del Equipo (Grupo, Array)
        $grupoEquipo = Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'label' => 'miembros_equipo',
            'tipo' => 'grupo',
            'estructura' => 'array',
            'max_items' => 10, // Máximo 10 miembros
            'orden' => 4,
            'requerida' => true,
        ]);

        // 7. Crear Preguntas HIJAS para el Grupo "Miembros del Equipo"
        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'parent_id' => $grupoEquipo->id,
            'label' => 'nombre',
            'tipo' => 'texto',
            'estructura' => 'objeto',
            'orden' => 1,
        ]);

        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'parent_id' => $grupoEquipo->id,
            'label' => 'cargo',
            'tipo' => 'texto',
            'estructura' => 'objeto',
            'orden' => 2,
        ]);

        Pregunta::create([
            'seccion_id' => $seccionNosotros->id,
            'parent_id' => $grupoEquipo->id,
            'label' => 'foto',
            'tipo' => 'imagen',
            'estructura' => 'objeto',
            'orden' => 3,
        ]);

        // 8. Crear Respuestas de Ejemplo
        \App\Models\Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $seccionNosotros->preguntas()->where('label', 'titulo_principal')->first()->id,
            'valor' => 'Conoce a nuestro equipo',
        ]);

        \App\Models\Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $seccionNosotros->preguntas()->where('label', 'galeria_oficina')->first()->id,
            'valor' => json_encode(['oficina1.jpg', 'oficina2.jpg']),
        ]);

        \App\Models\Respuesta::create([
            'plantilla_id' => $plantilla->id,
            'pregunta_id' => $grupoEquipo->id,
            'valor' => json_encode([
                [
                    ['label' => 'nombre', 'valor' => 'Juan Perez'],
                    ['label' => 'cargo', 'valor' => 'CEO'],
                    ['label' => 'foto', 'valor' => 'juan.jpg'],
                ],
                [
                    ['label' => 'nombre', 'valor' => 'Maria Lopez'],
                    ['label' => 'cargo', 'valor' => 'Directora de Marketing'],
                    ['label' => 'foto', 'valor' => 'maria.jpg'],
                ],
            ]),
        ]);
    }
}
