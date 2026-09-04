<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use App\Models\Pregunta;
use App\Models\Producto;
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
    public function redirectToFirst(string $param1, ?string $param2 = null): RedirectResponse
    {
        $dominio = $param1;
        $siteSlug = $param2;

        $siteModel = $this->findSite($dominio, $siteSlug);
        $primeraSeccion = $siteModel->plantilla->secciones
            ->where('activa', true)
            ->reject(fn ($s) => strtolower($s->slug) === 'nav')
            ->first();

        $seccionSlug = $primeraSeccion ? $primeraSeccion->slug : 'Inicio';

        return $siteSlug
            ? Redirect::to("/{$dominio}/{$siteSlug}/{$seccionSlug}")
            : Redirect::to("/{$dominio}/{$seccionSlug}");
    }

    public function show(string $param1, string $param2, ?string $param3 = null): Response|RedirectResponse
    {
        if ($param3 !== null) {
            $dominio = $param1;
            $siteSlug = $param2;
            $seccionSlug = $param3;
        } else {
            $siteBySlug = Site::where('slug', $param2)
                ->whereHas('dominio', fn ($q) => $q->where('nombre', $param1))
                ->first();

            if ($siteBySlug) {
                return $this->redirectToFirst($param1, $param2);
            }

            $dominio = $param1;
            $siteSlug = null;
            $seccionSlug = $param2;
        }

        $site = $this->findSite($dominio, $siteSlug);

        $seccionesNav = $site->plantilla->secciones
            ->where('activa', true)
            ->reject(fn ($s) => strtolower($s->slug) === 'nav');

        $targetSlug = strtolower(str_replace(['_', ' '], '-', $seccionSlug));
        $seccion = $site->plantilla->secciones->first(function ($s) use ($targetSlug) {
            $sSlug = strtolower(str_replace(['_', ' '], '-', $s->slug));
            $sNombre = strtolower(str_replace(['_', ' '], '-', $s->nombre));
            return $sSlug === $targetSlug || $sNombre === $targetSlug || str_contains($sSlug, $targetSlug) || str_contains($targetSlug, $sSlug);
        }) ?? $seccionesNav->first();

        abort_unless($seccion instanceof Seccion, 404);

        $siteRespuestas = $site->respuestas->keyBy('pregunta_id')->all();
        $plantillaRespuestas = \App\Models\Respuesta::where('plantilla_id', $site->plantilla_id)->get()->keyBy('pregunta_id')->all();
        $respuestas = $siteRespuestas + $plantillaRespuestas;

        // Pre-cargar el contenido de TODAS las secciones (activas e inanimadas/ocultas del nav) para renderizado instantáneo
        $seccionesData = [];
        foreach ($site->plantilla->secciones as $s) {
            $key = strtolower(str_replace(['_', ' '], '-', $s->slug));
            $seccionesData[$key] = [
                'slug' => $s->slug,
                'nombre' => $s->nombre,
                'contenido' => self::formatearPreguntas($s->preguntas, $respuestas),
            ];
        }

        $tiendaIds = $site->tiendas->pluck('id')->all();

        $productosQuery = \App\Models\Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true);

        if (! empty($tiendaIds)) {
            $productosQuery->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        } else {
            $productosQuery->whereRaw('1 = 0');
        }

        $productos = $productosQuery->orderBy('orden')->orderBy('nombre')->get();
        $productosDestacados = $productos->where('destacado', true)->values();

        $estilos = array_merge($site->plantilla->estilos ?? [], $site->estilos ?? []);

        return Inertia::render(self::paginaPlantilla($site->plantilla), [
            'site' => [
                'id' => $site->id,
                'nombre' => $site->nombre,
                'slug' => $site->slug,
                'imagen' => $site->imagen ? asset('storage/'.$site->imagen) : null,
                'plantilla_id' => $site->plantilla_id,
            ],
            'dominio' => $dominio,
            'siteSlug' => $siteSlug,
            'tieneTienda' => ! empty($tiendaIds),
            'secciones' => $seccionesNav
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
            'productos' => \App\Http\Resources\v1\ProductoResource::collection($productos)->resolve(),
            'productosDestacados' => \App\Http\Resources\v1\ProductoResource::collection($productosDestacados)->resolve(),
            'estilos' => $estilos,
        ]);
    }

    private function findSite(string $dominioOrSlug, ?string $siteSlug = null): Site
    {
        $query = Site::query()
            ->with(['plantilla.secciones.preguntas', 'dominio', 'respuestas'])
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

            // Si viene con claves asociativas (ej. UUIDs de Filament), convertir a lista indexada [0, 1, ...]
            if (! empty($valor) && ! array_is_list($valor)) {
                $valor = array_values($valor);
            }

            return array_values(array_map(function ($item) use ($childrenMap) {
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
            }, $valor));
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
                    if (str_contains($ruta, '127.0.0.1') || str_contains($ruta, 'localhost')) {
                        $cleanPath = preg_replace('/^https?:\/\/[^\/]+\/(storage\/)?/', '', $ruta);
                        if (request()->hasHeader('Host')) {
                            return request()->schemeAndHttpHost() . '/storage/' . ltrim($cleanPath, '/');
                        }
                    }
                    return $ruta;
                }

                $cleanPath = ltrim($ruta, '/');
                if (request()->hasHeader('Host')) {
                    return request()->schemeAndHttpHost() . '/storage/' . $cleanPath;
                }

                return Storage::disk('public')->url($cleanPath);
            };

            return is_array($valor)
                ? array_values(array_map($formatUrl, $valor))
                : $formatUrl((string) $valor);
        }

        return $valor;
    }
}
