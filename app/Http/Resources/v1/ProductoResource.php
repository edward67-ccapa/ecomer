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
            'descripcion' => $this->descripcion,
            'precio' => (float) $this->precio,
            'precio_oferta' => $this->precio_oferta ? (float) $this->precio_oferta : null,
            'precio_soles' => (float) $this->precio,
            'precio_oferta_soles' => $this->precio_oferta ? (float) $this->precio_oferta : null,
            'precio_dolares' => $this->precio_dolares ? (float) $this->precio_dolares : null,
            'precio_oferta_dolares' => $this->precio_oferta_dolares ? (float) $this->precio_oferta_dolares : null,
            'precio_euros' => $this->precio_euros ? (float) $this->precio_euros : null,
            'precio_oferta_euros' => $this->precio_oferta_euros ? (float) $this->precio_oferta_euros : null,
            'imagen' => $this->imagen ? asset('storage/'.$this->imagen) : null,
            'imagenes' => is_array($this->imagenes)
                ? array_map(fn (string $img) => asset('storage/'.$img), $this->imagenes)
                : [],
            'categoria' => $this->categoria?->nombre,
            'subcategoria' => $this->subcategoria?->nombre,
            'variantes' => $this->whenLoaded('variantes'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
