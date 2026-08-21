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

        $seccionesNav = $plantilla->secciones->where('activa', true);

        $seccionModel = $plantilla->secciones
            ->when(filled($seccion), function ($items) use ($seccion) {
                $target = strtolower(str_replace(['_', ' '], '-', $seccion));
                return $items->filter(fn ($s) => strtolower(str_replace(['_', ' '], '-', $s->slug)) === $target);
            })
            ->first();

        if (filled($seccion) && ! $seccionModel) {
            abort(404);
        }

        $seccionModel ??= $plantilla->secciones
            ->where('activa', true)
            ->reject(fn ($s) => strtolower($s->slug) === 'nav')
            ->first() ?? $seccionesNav->first();

        abort_unless($seccionModel instanceof Seccion, 404);

        $respuestas = $plantilla->respuestas->keyBy('pregunta_id');

        $contenido = SitePageController::formatearPreguntas($seccionModel->preguntas, $respuestas);

        $seccionesData = [];
        foreach ($plantilla->secciones as $s) {
            $key = strtolower(str_replace(['_', ' '], '-', $s->slug));
            $seccionesData[$key] = [
                'slug' => $s->slug,
                'nombre' => $s->nombre,
                'contenido' => SitePageController::formatearPreguntas($s->preguntas, $respuestas),
            ];
        }

        return Inertia::render(SitePageController::paginaPlantilla($plantilla), [
            'site' => [
                'nombre' => $plantilla->nombre,
                'imagen' => $plantilla->imagen ? asset('storage/'.$plantilla->imagen) : null,
            ],
            'dominio' => 'plantillas',
            'siteSlug' => $plantilla->slug,
            'secciones' => $seccionesNav
                ->reject(fn (Seccion $s) => strtolower($s->slug) === 'nav')
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
            'seccionesData' => $seccionesData,
            'estilos' => $plantilla->estilos,
        ]);
    }
}
