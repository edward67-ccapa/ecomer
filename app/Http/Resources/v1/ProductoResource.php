<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'descripcion_corta' => $this->descripcion_corta,
            'descripcion' => $this->descripcion,
            'precio' => $this->precio !== null ? (float) $this->precio : null,
            'precio_oferta' => $this->precio_oferta ? (float) $this->precio_oferta : null,
            'precio_soles' => $this->precio !== null ? (float) $this->precio : null,
            'precio_oferta_soles' => $this->precio_oferta ? (float) $this->precio_oferta : null,
            'es_liquidacion' => (bool) ($this->es_liquidacion || $this->precio === null || (float) $this->precio === 0.0),
            'stock' => $this->stock !== null ? (int) $this->stock : null,
            'cantidad' => $this->cantidad,
            'precio_dolares' => $this->precio_dolares ? (float) $this->precio_dolares : null,
            'precio_oferta_dolares' => $this->precio_oferta_dolares ? (float) $this->precio_oferta_dolares : null,
            'precio_euros' => $this->precio_euros ? (float) $this->precio_euros : null,
            'precio_oferta_euros' => $this->precio_oferta_euros ? (float) $this->precio_oferta_euros : null,
            'imagen' => $this->imagen ? asset('storage/'.$this->imagen) : null,
            'imagenes' => is_array($this->imagenes)
                ? array_map(fn (string $img) => asset('storage/'.$img), $this->imagenes)
                : [],
            'categoria_id' => $this->categoria_id,
            'subcategoria_id' => $this->subcategoria_id,
            'marca_id' => $this->marca_id,
            'categoria' => $this->categoria?->nombre,
            'categoria_imagen' => $this->categoria?->imagen ? asset('storage/'.$this->categoria->imagen) : null,
            'categoria_icono' => $this->categoria?->icono,
            'categoria_objeto' => $this->categoria ? [
                'id' => $this->categoria->id,
                'nombre' => $this->categoria->nombre,
                'slug' => $this->categoria->slug,
                'imagen' => $this->categoria->imagen ? asset('storage/'.$this->categoria->imagen) : null,
                'icono' => $this->categoria->icono,
            ] : null,
            'subcategoria' => $this->subcategoria?->nombre,
            'marca' => $this->marca?->titulo,
            'marca_imagen' => $this->marca?->imagen ? asset('storage/'.$this->marca->imagen) : null,
            'marca_objeto' => $this->marca ? [
                'id' => $this->marca->id,
                'titulo' => $this->marca->titulo,
                'slug' => $this->marca->slug,
                'imagen' => $this->marca->imagen ? asset('storage/'.$this->marca->imagen) : null,
            ] : null,
            'almacen' => $this->tienda?->nombre ?? ($this->relationLoaded('tiendas') && $this->tiendas->isNotEmpty() ? $this->tiendas->map(fn ($t) => $t->nombre.($t->pivot?->stock !== null ? " ({$t->pivot->stock} disp.)" : ''))->join(', ') : null),
            'almacenes' => $this->relationLoaded('tiendas') ? $this->tiendas->map(fn ($t) => [
                'id' => $t->id,
                'nombre' => $t->nombre,
                'slug' => $t->slug,
                'stock' => $t->pivot?->stock !== null ? (int) $t->pivot->stock : null,
            ])->values()->all() : [],
            'tiendas' => $this->relationLoaded('tiendas') ? $this->tiendas->map(fn ($t) => [
                'id' => $t->id,
                'nombre' => $t->nombre,
                'slug' => $t->slug,
                'stock' => $t->pivot?->stock !== null ? (int) $t->pivot->stock : null,
            ])->values()->all() : [],
            'variantes' => $this->whenLoaded('variantes'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
