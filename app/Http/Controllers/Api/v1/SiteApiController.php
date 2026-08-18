<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Controllers\SitePageController;
use App\Http\Resources\v1\SiteResource;
use App\Models\Seccion;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SiteApiController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $sites = Site::with(['plantilla.secciones', 'dominio', 'tienda.monedas', 'monedas'])
            ->where('estado', 'publicado')
            ->orderBy('nombre')
            ->get();

        return SiteResource::collection($sites);
    }

    public function showSite(string $dominio, string $siteSlug): JsonResponse
    {
        $site = Site::query()
            ->with(['plantilla.secciones', 'dominio', 'tienda.monedas', 'monedas'])
            ->where('estado', 'publicado')
            ->where('slug', $siteSlug)
            ->whereHas('dominio', fn ($query) => $query->where('nombre', $dominio))
            ->firstOrFail();

        $primeraSeccion = $site->plantilla->secciones->where('activa', true)->first();

        return response()->json([
            'site' => new SiteResource($site),
            'primera_seccion' => $primeraSeccion?->slug,
        ]);
    }

    public function showSection(string $dominio, string $siteSlug, string $seccionSlug): JsonResponse
    {
        $site = Site::query()
            ->with(['plantilla.secciones.preguntas', 'dominio', 'respuestas'])
            ->where('estado', 'publicado')
            ->where('slug', $siteSlug)
            ->whereHas('dominio', fn ($query) => $query->where('nombre', $dominio))
            ->firstOrFail();

        $secciones = $site->plantilla->secciones->where('activa', true);

        $seccion = $secciones->first(function ($s) use ($seccionSlug) {
            $normalize = fn ($str) => strtolower(str_replace(['_', ' '], '-', $str));
            return $normalize($s->slug) === $normalize($seccionSlug);
        });

        if (! $seccion instanceof Seccion) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $respuestas = $site->respuestas->keyBy('pregunta_id');

        $contenido = SitePageController::formatearPreguntas($seccion->preguntas, $respuestas);

        $estilos = array_merge($site->plantilla->estilos ?? [], $site->estilos ?? []);

        return response()->json([
            'slug' => $seccion->slug,
            'nombre' => $seccion->nombre,
            'contenido' => $contenido,
        ]);
    }
}
