<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\ProductoResource;
use App\Models\Plantilla;
use App\Models\Producto;
use App\Models\Site;
use App\Models\Tienda;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductoApiController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $productos = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return ProductoResource::collection($productos);
    }

    public function destacados(): AnonymousResourceCollection
    {
        $productos = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->where('destacado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return ProductoResource::collection($productos);
    }

    public function showTienda(Tienda $tienda): JsonResponse
    {
        return response()->json([
            'id' => $tienda->id,
            'nombre' => $tienda->nombre,
            'slug' => $tienda->slug,
            'descripcion' => $tienda->descripcion,
            'logo' => $tienda->logo ? asset('storage/'.$tienda->logo) : null,
        ]);
    }

    public function indexByTienda(Tienda $tienda): AnonymousResourceCollection
    {
        $productos = $tienda->productos()
            ->with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return ProductoResource::collection($productos);
    }

    public function indexByPlantilla(Plantilla $plantilla): AnonymousResourceCollection
    {
        $tiendaIds = $plantilla->tiendas->pluck('id')->all();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true);

        if (! empty($tiendaIds)) {
            $query->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        }

        $productos = $query->orderBy('orden')->orderBy('nombre')->get();

        return ProductoResource::collection($productos);
    }

    public function destacadosByPlantilla(Plantilla $plantilla): AnonymousResourceCollection
    {
        $tiendaIds = $plantilla->tiendas->pluck('id')->all();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->where('destacado', true);

        if (! empty($tiendaIds)) {
            $query->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        }

        $productos = $query->orderBy('orden')->orderBy('nombre')->get();

        return ProductoResource::collection($productos);
    }

    private function findSite(string $dominioOrSlug, ?string $siteSlug = null): Site
    {
        $query = Site::with('tiendas')
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

    public function indexBySite(string $param1, ?string $param2 = null): AnonymousResourceCollection
    {
        $site = $this->findSite($param1, $param2);

        $tiendaIds = $site->tiendas->pluck('id')->all();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true);

        if (! empty($tiendaIds)) {
            $query->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        } else {
            $query->whereRaw('1 = 0');
        }

        $productos = $query->orderBy('orden')->orderBy('nombre')->get();

        return ProductoResource::collection($productos);
    }

    public function destacadosBySite(string $param1, ?string $param2 = null): AnonymousResourceCollection
    {
        $site = $this->findSite($param1, $param2);

        $tiendaIds = $site->tiendas->pluck('id')->all();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->where('destacado', true);

        if (! empty($tiendaIds)) {
            $query->whereHas('tiendas', fn ($q) => $q->whereIn('tiendas.id', $tiendaIds));
        } else {
            $query->whereRaw('1 = 0');
        }

        $productos = $query->orderBy('orden')->orderBy('nombre')->get();

        return ProductoResource::collection($productos);
    }

    public function show(Producto $producto): ProductoResource
    {
        $producto->load(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda']);

        return new ProductoResource($producto);
    }
}
