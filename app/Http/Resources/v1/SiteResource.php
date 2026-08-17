<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
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
            'estado' => $this->estado,
            'imagen' => $this->imagen ? asset('storage/'.$this->imagen) : null,
            'dominio' => $this->dominio?->nombre,
            'estilos' => array_merge($this->plantilla->estilos ?? [], $this->estilos ?? []),
            'plantilla' => new PlantillaResource($this->whenLoaded('plantilla')),
            'secciones' => SeccionResource::collection(
                $this->plantilla ? $this->plantilla->secciones->where('activa', true) : collect()
            ),
        ];
    }
}
