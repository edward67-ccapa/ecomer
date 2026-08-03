<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use App\Models\Pregunta;
use App\Models\Respuesta;
use App\Models\Seccion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlantillasController extends Controller
{
    public function index(Request $request): Response
    {
        $plantillas = Plantilla::withCount('secciones')
            ->where('activa', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn (Plantilla $plantilla): array => [
                'id' => $plantilla->id,
                'slug' => $plantilla->slug,
                'tipo' => $plantilla->tipo,
                'nombre' => $plantilla->nombre,
                'descripcion' => $plantilla->descripcion,
                'imagen' => $plantilla->imagen ? asset('storage/'.$plantilla->imagen) : null,
                'secciones' => $plantilla->secciones_count,
                'estilos' => $plantilla->estilos,
            ]);

        return Inertia::render('plantillas/Index', [
            'plantillas' => $plantillas,
        ]);
    }

    public function preview(Plantilla $plantilla, ?string $seccion = null): Response
    {
        $plantilla->load(['secciones.preguntas', 'respuestas']);

        $secciones = $plantilla->secciones->where('activa', true);

        $seccionModel = $secciones
            ->when(filled($seccion), fn ($items) => $items->where('slug', $seccion))
            ->first();

        if (filled($seccion) && ! $seccionModel) {
            abort(404);
        }

        $seccionModel ??= $secciones->first();

        abort_unless($seccionModel instanceof Seccion, 404);

        $respuestas = $plantilla->respuestas->mapWithKeys(
            fn (Respuesta $respuesta): array => [$respuesta->pregunta_id => $respuesta->valor],
        );

        $contenido = $seccionModel->preguntas->map(fn (Pregunta $pregunta): array => [
            'label' => $pregunta->label,
            'tipo' => $pregunta->tipo,
            'valor' => SitePageController::valorPublico($pregunta->tipo, $respuestas[$pregunta->id] ?? null),
        ]);

        return Inertia::render('sites/Index', [
            'site' => [
                'nombre' => $plantilla->nombre,
                'imagen' => $plantilla->imagen ? asset('storage/'.$plantilla->imagen) : null,
            ],
            'dominio' => 'plantillas',
            'siteSlug' => $plantilla->slug,
            'secciones' => $secciones
                ->map(fn (Seccion $s): array => [
                    'slug' => $s->slug,
                    'nombre' => $s->nombre,
                ])
                ->values(),
            'seccionActiva' => [
                'slug' => $seccionModel->slug,
                'nombre' => $seccionModel->nombre,
                'contenido' => $contenido,
            ],
            'estilos' => $plantilla->estilos,
        ]);
    }
}
