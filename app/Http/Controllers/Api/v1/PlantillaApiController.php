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

        $secciones = $plantilla->secciones;

        // Si no se especifica sección, devolver metadatos generales (plantilla, secciones, estilos)
        if (blank($seccion)) {
            return response()->json([
                'plantilla' => new PlantillaResource($plantilla),
                'secciones' => $secciones->where('activa', true)->map(fn ($s) => ['slug' => $s->slug, 'nombre' => $s->nombre])->values(),
                'estilos' => $plantilla->estilos,
            ]);
        }

        // Devolver únicamente el contenido de la sección solicitada (ligero y rápido)
        $seccionModel = $secciones->first(
            fn ($s) => strtolower($s->slug) === strtolower($seccion)
        );

        if (! $seccionModel instanceof Seccion) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $respuestas = $plantilla->respuestas->whereNull('site_id')->keyBy('pregunta_id');

        $contenido = SitePageController::formatearPreguntas($seccionModel->preguntas, $respuestas);

        return response()->json([
            'slug' => $seccionModel->slug,
            'nombre' => $seccionModel->nombre,
            'contenido' => $contenido,
        ]);
    }
}
