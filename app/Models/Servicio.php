<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'servicios_id',
    'titulo',
    'subtitulo',
    'descripcion',
    'descripcioncorta',
    'lista',
    'icono',
    'imagen',
    'boton',
    'url',
    'orden',
    'activo',
])]
class Servicio extends Model
{
    protected $table = 'servicio';

    /**
     * Atributos agregados a la serialización JSON / Array.
     */
    protected $appends = [
        'lista_array',
    ];

    public function servicioPadre(): BelongsTo
    {
        return $this->belongsTo(Servicios::class, 'servicios_id');
    }

    /**
     * Convierte la cadena 'calidad/* /mejora/* /inversion' en un arreglo ['calidad', 'mejora', 'inversion'].
     *
     * @return array<int, string>
     */
    public function getListaArrayAttribute(): array
    {
        if (blank($this->lista)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode('/*/', $this->lista))));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'activo' => 'boolean',
        ];
    }
}
