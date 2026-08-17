<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlantillaResource extends JsonResource
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
            'slug' => $this->slug,
            'tipo' => $this->tipo,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'imagen' => $this->imagen ? asset('storage/'.$this->imagen) : null,
            'estilos' => $this->estilos,
            'activa' => (bool) $this->activa,
            'secciones_count' => $this->whenCounted('secciones'),
            'secciones' => SeccionResource::collection($this->whenLoaded('secciones')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
