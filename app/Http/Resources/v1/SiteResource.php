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
            'tienda_id' => $this->tienda_id,
            'tienda' => $this->whenLoaded('tienda', fn () => [
                'id' => $this->tienda->id,
                'nombre' => $this->tienda->nombre,
                'slug' => $this->tienda->slug,
            ]),
            'moneda' => [
                'codigo' => $this->moneda?->codigo ?? $this->tienda?->moneda?->codigo ?? 'PEN',
                'simbolo' => $this->moneda?->simbolo ?? $this->tienda?->moneda?->simbolo ?? 'S/',
                'nombre' => $this->moneda?->nombre ?? $this->tienda?->moneda?->nombre ?? 'Soles Peruanos',
            ],
            'monedas_aceptadas' => $this->monedas->isNotEmpty()
                ? $this->monedas->map(fn ($m) => ['codigo' => $m->codigo, 'simbolo' => $m->simbolo, 'nombre' => $m->nombre])->values()
                : ($this->tienda && $this->tienda->relationLoaded('monedas') && $this->tienda->monedas->isNotEmpty()
                    ? $this->tienda->monedas->map(fn ($m) => ['codigo' => $m->codigo, 'simbolo' => $m->simbolo, 'nombre' => $m->nombre])->values()
                    : [
                        ['codigo' => 'PEN', 'simbolo' => 'S/', 'nombre' => 'Soles Peruanos'],
                    ]),
            'estilos' => array_merge($this->plantilla->estilos ?? [], $this->estilos ?? []),
            'plantilla' => new PlantillaResource($this->whenLoaded('plantilla')),
            'secciones' => SeccionResource::collection(
                $this->plantilla ? $this->plantilla->secciones->where('activa', true) : collect()
            ),
        ];
    }
}
