<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Controllers\SitePageController;
use App\Http\Resources\v1\PlantillaResource;
use App\Models\Plantilla;
use App\Models\Seccion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlantillaApiController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $plantillas = Plantilla::withCount('secciones')
            ->with('secciones')
            ->where('activa', true)
            ->orderBy('nombre')
            ->get();

        return PlantillaResource::collection($plantillas);
    }

    public function show(Plantilla $plantilla): PlantillaResource
    {
        $plantilla->load(['secciones.preguntas']);

        return new PlantillaResource($plantilla);
    }

    public function preview(Plantilla $plantilla, ?string $seccion = null): JsonResponse
    {
        $plantilla->load(['secciones.preguntas', 'respuestas']);

        $secciones = $plantilla->secciones->where('activa', true);

        $seccionModel = $secciones
            ->when(filled($seccion), fn ($items) => $items->where('slug', $seccion))
            ->first();

        if (filled($seccion) && ! $seccionModel) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $seccionModel ??= $secciones->first();

        if (! $seccionModel instanceof Seccion) {
            return response()->json(['message' => 'No hay secciones activas'], 404);
        }

        $respuestas = $plantilla->respuestas->keyBy('pregunta_id');

        $contenido = SitePageController::formatearPreguntas($seccionModel->preguntas, $respuestas);

        return response()->json([
            'plantilla' => new PlantillaResource($plantilla),
            'secciones' => $secciones->map(fn ($s) => ['slug' => $s->slug, 'nombre' => $s->nombre])->values(),
            'seccionActiva' => [
                'slug' => $seccionModel->slug,
                'nombre' => $seccionModel->nombre,
                'contenido' => $contenido,
            ],
            'estilos' => $plantilla->estilos,
        ]);
    }
}
