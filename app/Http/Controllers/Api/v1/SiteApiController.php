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

    private function findSite(string $dominioOrSlug, ?string $siteSlug = null): Site
    {
        $query = Site::query()
            ->with(['plantilla.secciones.preguntas', 'dominio', 'respuestas', 'tiendas.moneda'])
            ->where('estado', 'publicado');

        if ($siteSlug) {
            $query->where('slug', $siteSlug)
                ->whereHas('dominio', fn ($q) => $q->whereRaw('LOWER(nombre) = ?', [strtolower($dominioOrSlug)]));
        } else {
            $query->where(function ($q) use ($dominioOrSlug) {
                $q->where('slug', $dominioOrSlug)
                  ->orWhereRaw('LOWER(slug) = ?', [strtolower($dominioOrSlug)])
                  ->orWhereHas('dominio', fn ($d) => $d->whereRaw('LOWER(nombre) = ?', [strtolower($dominioOrSlug)]));
            });
        }

        return $query->firstOrFail();
    }

    public function showSite(string $param1, ?string $param2 = null): JsonResponse
    {
        $site = $this->findSite($param1, $param2);

        $primeraSeccion = $site->plantilla->secciones
            ->where('activa', true)
            ->reject(fn ($s) => strtolower($s->slug) === 'nav')
            ->first();

        return response()->json([
            'site' => new SiteResource($site),
            'primera_seccion' => $primeraSeccion?->slug,
        ]);
    }

    public function showSection(string $param1, string $param2, ?string $param3 = null): JsonResponse
    {
        if ($param3 !== null) {
            $dominio = $param1;
            $siteSlug = $param2;
            $seccionSlug = $param3;
        } else {
            $dominio = $param1;
            $siteSlug = null;
            $seccionSlug = $param2;
        }

        $site = $this->findSite($dominio, $siteSlug);

        $targetSlug = strtolower(str_replace(['_', ' '], '-', $seccionSlug));
        $seccion = $site->plantilla->secciones->first(function ($s) use ($targetSlug) {
            return strtolower(str_replace(['_', ' '], '-', $s->slug)) === $targetSlug;
        }) ?? $site->plantilla->secciones->reject(fn ($s) => strtolower($s->slug) === 'nav')->first();

        if (! $seccion instanceof Seccion) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $siteRespuestas = $site->respuestas->keyBy('pregunta_id')->all();
        $plantillaRespuestas = \App\Models\Respuesta::where('plantilla_id', $site->plantilla_id)->get()->keyBy('pregunta_id')->all();
        $respuestas = $siteRespuestas + $plantillaRespuestas;

        $contenido = SitePageController::formatearPreguntas($seccion->preguntas, $respuestas);

        $estilos = array_merge($site->plantilla->estilos ?? [], $site->estilos ?? []);

        return response()->json([
            'slug' => $seccion->slug,
            'nombre' => $seccion->nombre,
            'contenido' => $contenido,
        ]);
    }
}
