<?php

namespace App\Http\Controllers;

use App\Models\Pregunta;
use App\Models\Seccion;
use App\Models\Site;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
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

        $seccion = $site->plantilla->secciones
            ->where('slug', $seccionSlug)
            ->where('activa', true)
            ->first();

        abort_unless($seccion instanceof Seccion, 404);

        $respuestas = $site->respuestas->mapWithKeys(
            fn ($respuesta): array => [$respuesta->pregunta_id => $respuesta],
        );

        $contenido = self::formatearPreguntas($seccion->preguntas, $respuestas);

        $estilos = array_merge($site->plantilla->estilos ?? [], $site->estilos ?? []);

        return Inertia::render(self::paginaPlantilla($site->plantilla->tipo), [
            'site' => [
                'nombre' => $site->nombre,
                'imagen' => $site->imagen ? asset('storage/'.$site->imagen) : null,
            ],
            'dominio' => $dominio,
            'siteSlug' => $site->slug,
            'secciones' => $site->plantilla->secciones
                ->where('activa', true)
                ->map(fn (Seccion $s): array => [
                    'slug' => $s->slug,
                    'nombre' => $s->nombre,
                ])
                ->values(),
            'seccionActiva' => [
                'slug' => $seccion->slug,
                'nombre' => $seccion->nombre,
                'contenido' => $contenido,
            ],
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

    public static function paginaPlantilla(string $tipo): string
    {
        return match ($tipo) {
            'ecommerce', 'landing_page' => 'sites/Ecomer1/Index',
            default => 'sites/Index',
        };
    }

    public static function formatearPreguntas($preguntas, $respuestas): array
    {
        return $preguntas->whereNull('parent_id')->map(function (Pregunta $pregunta) use ($preguntas, $respuestas): array {
            $respuesta = $respuestas[$pregunta->id] ?? null;

            $data = [
                'label' => $pregunta->label,
                'tipo' => $pregunta->tipo,
                'estructura' => $pregunta->estructura ?? 'objeto',
                'max_items' => $pregunta->max_items,
                'valor' => self::valorPublico($pregunta->tipo, $respuesta?->valor),
                'enlace' => $respuesta?->enlace,
            ];

            if ($pregunta->tipo === 'grupo') {
                $data['plantilla_campos'] = $preguntas->where('parent_id', $pregunta->id)->map(function ($child) {
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

    public static function valorPublico(string $tipo, mixed $valor): mixed
    {
        if (is_null($valor)) {
            return null;
        }

        if (is_string($valor) && is_array($decoded = json_decode($valor, true))) {
            $valor = $decoded;
        }

        if ($tipo === 'grupo' && is_array($valor)) {
            return array_map(function ($grupo) {
                return array_map(function ($campo) {
                    $campo['valor'] = self::valorPublico($campo['tipo'] ?? 'texto', $campo['valor'] ?? null);
                    return $campo;
                }, $grupo);
            }, $valor);
        }

        $rutas = is_array($valor) ? $valor : [$valor];

        return match ($tipo) {
            'imagen' => Storage::disk('public')->url($rutas[0] ?? ''),
            'galeria' => array_map(
                fn (string $ruta): string => Storage::disk('public')->url($ruta),
                $rutas,
            ),
            default => $valor,
        };
    }
}
