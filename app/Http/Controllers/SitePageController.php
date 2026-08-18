<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use App\Models\Pregunta;
use App\Models\Seccion;
use App\Models\Site;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SitePageController extends Controller
{
    public function redirectToFirst(string $dominio, string $site): RedirectResponse
    {
        $site = $this->findSite($dominio, $site);

        return Redirect::to("/{$dominio}/{$site->slug}/{$site->plantilla->secciones->first()->slug}");
    }

    public function show(string $dominio, string $siteSlug, string $seccionSlug): Response
    {
        $site = $this->findSite($dominio, $siteSlug);

        $secciones = $site->plantilla->secciones->where('activa', true);

        $seccion = $secciones->firstWhere('slug', $seccionSlug);

        abort_unless($seccion instanceof Seccion, 404);

        $respuestas = $site->respuestas->keyBy('pregunta_id');

        // Pre-cargar el contenido de TODAS las secciones activas para renderizado instantáneo
        $seccionesData = [];
        foreach ($secciones as $s) {
            $key = strtolower(str_replace(['_', ' '], '-', $s->slug));
            $seccionesData[$key] = [
                'slug' => $s->slug,
                'nombre' => $s->nombre,
                'contenido' => self::formatearPreguntas($s->preguntas, $respuestas),
            ];
        }

        // Pre-cargar productos destacados si tiene tienda asignada
        $productosDestacados = [];
        if ($site->tienda) {
            $productosDestacados = \App\Http\Controllers\Api\v1\ProductoApiController::formatearProductos(
                $site->tienda->productos()->where('destacado', true)->get()
            );
        }

        $estilos = array_merge($site->plantilla->estilos ?? [], $site->estilos ?? []);

        return Inertia::render(self::paginaPlantilla($site->plantilla), [
            'site' => [
                'nombre' => $site->nombre,
                'imagen' => $site->imagen ? asset('storage/'.$site->imagen) : null,
            ],
            'dominio' => $dominio,
            'siteSlug' => $site->slug,
            'secciones' => $secciones
                ->map(fn (Seccion $s): array => [
                    'slug' => $s->slug,
                    'nombre' => $s->nombre,
                ])
                ->values(),
            'seccionActiva' => $seccionesData[strtolower(str_replace(['_', ' '], '-', $seccion->slug))] ?? [
                'slug' => $seccion->slug,
                'nombre' => $seccion->nombre,
                'contenido' => self::formatearPreguntas($seccion->preguntas, $respuestas),
            ],
            'seccionesData' => $seccionesData,
            'productosDestacados' => $productosDestacados,
            'estilos' => $estilos,
        ]);
    }

    private function findSite(string $dominio, string $site): Site
    {
        return Site::query()
            ->with(['plantilla.secciones.preguntas', 'dominio', 'respuestas'])
            ->where('estado', 'publicado')
            ->where('slug', $site)
            ->whereHas('dominio', fn ($query) => $query->where('nombre', $dominio))
            ->firstOrFail();
    }

    public static function paginaPlantilla(Plantilla|string $plantillaOrTipo): string
    {
        if ($plantillaOrTipo instanceof Plantilla) {
            $studlySlug = Str::studly($plantillaOrTipo->slug);
            if (file_exists(resource_path("js/pages/sites/{$studlySlug}/Index.jsx"))) {
                return "sites/{$studlySlug}/Index";
            }

            if ($plantillaOrTipo->slug === 'plantilla-corporativa') {
                return 'sites/Corporativa/Index';
            }

            $tipo = $plantillaOrTipo->tipo;
        } else {
            $tipo = $plantillaOrTipo;
        }

        return match ($tipo) {
            'ecommerce' => 'sites/Ecomer1/Index',
            'landing_page' => 'sites/Corporativa/Index',
            'anuncio' => 'sites/Anuncio/Index',
            default => 'sites/Index',
        };
    }

    public static function formatearPreguntas($preguntas, $respuestas): array
    {
        return $preguntas->whereNull('parent_id')->map(function (Pregunta $pregunta) use ($preguntas, $respuestas): array {
            $respuesta = $respuestas[$pregunta->id] ?? null;

            $children = ($pregunta->relationLoaded('children') && $pregunta->children->isNotEmpty())
                ? $pregunta->children
                : ($preguntas->where('parent_id', $pregunta->id)->isNotEmpty()
                    ? $preguntas->where('parent_id', $pregunta->id)
                    : $pregunta->children);

            $data = [
                'label' => $pregunta->label,
                'tipo' => $pregunta->tipo,
                'estructura' => $pregunta->estructura ?? 'objeto',
                'max_items' => $pregunta->max_items,
                'valor' => self::valorPublico($pregunta->tipo, $respuesta?->valor, $children),
                'enlace' => $respuesta?->enlace,
            ];

            if ($pregunta->tipo === 'grupo') {
                $data['plantilla_campos'] = $children->map(function ($child) {
                    return [
                        'label' => $child->label,
                        'tipo' => $child->tipo,
                        'valor' => null,
                    ];
                })->values()->toArray();
            }

            return $data;
        })->values()->toArray();
    }

    public static function valorPublico(string $tipo, mixed $valor, $children = null): mixed
    {
        if (is_null($valor)) {
            return null;
        }

        if (is_string($valor) && is_array($decoded = json_decode($valor, true))) {
            $valor = $decoded;
        }

        if ($tipo === 'grupo' && is_array($valor)) {
            $childrenMap = ($children && $children->isNotEmpty()) ? $children->keyBy('label') : collect();

            return array_map(function ($item) use ($childrenMap) {
                if (! is_array($item)) {
                    return $item;
                }

                // Normalizar si viene en formato antiguo [[{"label": "x", "valor": "y"}]]
                if (isset($item[0]) && is_array($item[0]) && isset($item[0]['label'])) {
                    $normalized = [];
                    foreach ($item as $campo) {
                        if (isset($campo['label'])) {
                            $normalized[$campo['label']] = $campo['valor'] ?? null;
                        }
                    }
                    $item = $normalized;
                }

                // Formatear cada campo del objeto (por ejemplo URLs de imágenes)
                $formattedItem = [];
                foreach ($item as $key => $val) {
                    $childPregunta = $childrenMap[$key] ?? null;
                    $childTipo = $childPregunta ? $childPregunta->tipo : null;

                    if (! $childTipo) {
                        $lowerKey = strtolower((string) $key);
                        if (str_contains($lowerKey, 'imagen') || str_contains($lowerKey, 'foto') || str_contains($lowerKey, 'logo') || str_contains($lowerKey, 'img')) {
                            $childTipo = 'imagen';
                        } else {
                            $childTipo = 'texto';
                        }
                    }

                    $formattedItem[$key] = self::valorPublico($childTipo, $val);
                }

                return $formattedItem;
            }, $valor);
        }

        if ($tipo === 'imagen' || $tipo === 'galeria') {
            if (empty($valor)) {
                return null;
            }

            $formatUrl = function ($ruta) {
                if (empty($ruta) || ! is_string($ruta)) {
                    return $ruta;
                }
                if (str_starts_with($ruta, 'http://') || str_starts_with($ruta, 'https://')) {
                    return $ruta;
                }

                return Storage::disk('public')->url(ltrim($ruta, '/'));
            };

            return is_array($valor)
                ? array_map($formatUrl, $valor)
                : $formatUrl((string) $valor);
        }

        return $valor;
    }
}
