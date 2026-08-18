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

    public function indexBySite(string $dominio, string $siteSlug): AnonymousResourceCollection
    {
        $site = Site::with('tienda')
            ->where('slug', $siteSlug)
            ->whereHas('dominio', fn ($q) => $q->where('nombre', $dominio))
            ->firstOrFail();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true);

        if ($site->tienda_id) {
            $query->whereHas('tiendas', fn ($q) => $q->where('tiendas.id', $site->tienda_id));
        }

        $productos = $query->orderBy('orden')->orderBy('nombre')->get();

        return ProductoResource::collection($productos);
    }

    public function destacadosBySite(string $dominio, string $siteSlug): AnonymousResourceCollection
    {
        $site = Site::with('tienda')
            ->where('slug', $siteSlug)
            ->whereHas('dominio', fn ($q) => $q->where('nombre', $dominio))
            ->firstOrFail();

        $query = Producto::with(['categoria', 'subcategoria', 'variantes', 'tiendas.moneda'])
            ->where('activo', true)
            ->where('destacado', true);

        if ($site->tienda_id) {
            $query->whereHas('tiendas', fn ($q) => $q->where('tiendas.id', $site->tienda_id));
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
