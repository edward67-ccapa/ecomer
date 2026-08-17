<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\ProductoResource;
use App\Models\Producto;
use App\Models\Tienda;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductoApiController extends Controller
{
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
            ->with(['categoria', 'subcategoria', 'variantes'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return ProductoResource::collection($productos);
    }

    public function show(Producto $producto): ProductoResource
    {
        $producto->load(['categoria', 'subcategoria', 'variantes']);

        return new ProductoResource($producto);
    }
}
