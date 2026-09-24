<?php

namespace App\Http\Controllers;

use App\Http\Resources\v1\ProductoResource;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Seccion;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $plantilla->load(['secciones.preguntas', 'respuestas', 'tiendas', 'servicios.servicios', 'marcas']);

        $seccionesNav = $plantilla->secciones->where('activa', true);

        $targetSlug = filled($seccion) ? strtolower(str_replace(['_', ' '], '-', $seccion)) : null;

        $seccionModel = $plantilla->secciones
            ->reject(fn ($s) => strtolower($s->slug) === 'nav')
            ->when(filled($seccion), function ($items) use ($targetSlug) {
                return $items->filter(function ($s) use ($targetSlug) {
                    $sSlug = strtolower(str_replace(['_', ' '], '-', $s->slug));
                    $sNombre = strtolower(str_replace(['_', ' '], '-', $s->nombre));
                    if ($targetSlug === 'inicio' || $targetSlug === 'hero') {
                        return in_array($sSlug, ['inicio', 'hero']) || in_array($sNombre, ['inicio', 'hero']);
                    }

                    return $sSlug === $targetSlug || $sNombre === $targetSlug;
                });
            })
            ->first();

        $respuestas = $plantilla->respuestas->keyBy('pregunta_id');

        if (filled($seccion) && ! $seccionModel && in_array($targetSlug, ['inicio', 'hero', 'productos', 'tienda', 'tiendas', 'servicios', 'servicio', 'nosotros', 'sobre-nosotros', 'contacto', 'contactos'])) {
            $canonicalSlug = in_array($targetSlug, ['productos', 'tienda', 'tiendas'])
                ? 'productos'
                : (in_array($targetSlug, ['servicios', 'servicio'])
                    ? 'servicios'
                    : (in_array($targetSlug, ['nosotros', 'sobre-nosotros'])
                        ? 'nosotros'
                        : (in_array($targetSlug, ['contacto', 'contactos']) ? 'contacto' : 'inicio')));
            $seccionActiva = [
                'slug' => $canonicalSlug,
                'nombre' => ucfirst($canonicalSlug),
                'contenido' => [],
            ];
        } else {
            if (filled($seccion) && ! $seccionModel) {
                abort(404);
            }

            $seccionModel ??= $plantilla->secciones
                ->where('activa', true)
                ->reject(fn ($s) => strtolower($s->slug) === 'nav')
                ->first() ?? $seccionesNav->first();

            abort_unless($seccionModel instanceof Seccion, 404);

            $contenido = SitePageController::formatearPreguntas($seccionModel->preguntas, $respuestas);

            $seccionActiva = [
                'slug' => $seccionModel->slug,
                'nombre' => $seccionModel->nombre,
                'contenido' => $contenido,
            ];
        }

        $seccionesData = [];
        foreach ($plantilla->secciones as $s) {
            $key = strtolower(str_replace(['_', ' '], '-', $s->slug));
            $seccionesData[$key] = [
                'slug' => $s->slug,
                'nombre' => $s->nombre,
                'contenido' => SitePageController::formatearPreguntas($s->preguntas, $respuestas),
            ];
        }

        $tiendaIds = $plantilla->tiendas->pluck('id')->filter()->all();

        $productosQuery = Producto::query()
            ->with(['categoria', 'variantes', 'moneda', 'tienda.moneda', 'tiendas.moneda'])
            ->where('activo', true);

        if (! empty($tiendaIds)) {
            $productosQuery->where(function ($q) use ($tiendaIds) {
                $q->whereIn('tienda_id', $tiendaIds)
                    ->orWhereHas('tiendas', fn ($sub) => $sub->whereIn('tiendas.id', $tiendaIds));
            });
        }

        $productos = (clone $productosQuery)->get();
        $productosDestacados = (clone $productosQuery)->where('destacado', true)->get();

        if ($productosDestacados->isEmpty() && $productos->isNotEmpty()) {
            $productosDestacados = $productos;
        }

        $serviciosSitio = $plantilla->servicios->flatMap(fn ($s) => $s->servicios ?? collect([$s]))->unique('id')->values();

        return Inertia::render(SitePageController::paginaPlantilla($plantilla), [
            'site' => [
                'id' => null,
                'nombre' => $plantilla->nombre,
                'slug' => $plantilla->slug,
                'imagen' => $plantilla->imagen ? asset('storage/'.$plantilla->imagen) : null,
                'plantilla_id' => $plantilla->id,
            ],
            'dominio' => 'plantillas',
            'siteSlug' => $plantilla->slug,
            'tieneTienda' => ! empty($tiendaIds),
            'secciones' => $seccionesNav
                ->reject(fn (Seccion $s) => strtolower($s->slug) === 'nav')
                ->map(fn (Seccion $s): array => [
                    'slug' => $s->slug,
                    'nombre' => $s->nombre,
                ])
                ->values(),
            'seccionActiva' => $seccionActiva,
            'seccionesData' => $seccionesData,
            'productos' => ProductoResource::collection($productos)->resolve(),
            'productosDestacados' => ProductoResource::collection($productosDestacados)->resolve(),
            'estilos' => $plantilla->estilos,
            'serviciosSitio' => $serviciosSitio,
        ]);
    }

    public function descargarCatalogo(Plantilla $plantilla)
    {
        $plantilla->load(['tiendas']);

        $estilos = $plantilla->estilos ?? [];
        $catalogoConfig = $estilos['catalogo'] ?? [];

        if (! empty($catalogoConfig['enlace'])) {
            $enlace = trim($catalogoConfig['enlace']);
            if (str_starts_with($enlace, 'http://') || str_starts_with($enlace, 'https://')) {
                return redirect()->away($enlace);
            }
            $cleanPath = preg_replace('/^\/?storage\//', '', $enlace);
            if (Storage::disk('public')->exists($cleanPath)) {
                return response()->download(Storage::disk('public')->path($cleanPath));
            }
        }

        $tiendaIds = $plantilla->tiendas->pluck('id')->all();

        $productosQuery = Producto::with(['categoria', 'subcategoria'])
            ->where('activo', true);

        if (! empty($tiendaIds)) {
            $productosQuery->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        }

        $tipoFiltro = $catalogoConfig['tipo_filtro'] ?? 'todos';
        if ($tipoFiltro === 'categoria' && ! empty($catalogoConfig['categorias'])) {
            $catIds = (array) $catalogoConfig['categorias'];
            $productosQuery->whereIn('categoria_id', $catIds);
        } elseif ($tipoFiltro === 'subcategoria' && ! empty($catalogoConfig['subcategorias'])) {
            $subCatIds = (array) $catalogoConfig['subcategorias'];
            $productosQuery->whereIn('subcategoria_id', $subCatIds);
        }

        $productos = $productosQuery->orderBy('orden')->orderBy('nombre')->get();
        $titulo = $catalogoConfig['titulo'] ?? 'Catálogo de Productos';
        $colorPrimario = $estilos['color_primario'] ?? '#F72F46';

        $pdf = Pdf::loadView('pdf.catalogo', [
            'site' => (object) ['nombre' => $plantilla->nombre, 'imagen' => $plantilla->imagen, 'estilos' => $estilos],
            'titulo' => $titulo,
            'productos' => $productos,
            'colorPrimario' => $colorPrimario,
            'estilos' => $estilos,
        ])->setOption('isGdEnabled', false)->setOption('isRemoteEnabled', true);

        $filename = Str::slug($titulo).'.pdf';

        return $pdf->download($filename);
    }
}
