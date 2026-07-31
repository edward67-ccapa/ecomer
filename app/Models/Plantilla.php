<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['slug', 'tipo', 'nombre', 'descripcion', 'imagen', 'estilos', 'activa'])]
class Plantilla extends Model
{
    public function secciones(): HasMany
    {
        return $this->hasMany(Seccion::class)->orderBy('orden');
    }

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    public function tiendas(): BelongsToMany
    {
        return $this->belongsToMany(Tienda::class);
    }

    public function respuestas(): HasMany
    {
        return $this->hasMany(Respuesta::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estilos' => 'array',
            'activa' => 'bool',
        ];
    }

    /**
     * Guarda los estilos descartando claves vacías.
     */
    public function setEstilosAttribute(mixed $value): void
    {
        $this->attributes['estilos'] = is_null($value)
            ? null
            : json_encode(array_filter($value, static fn (mixed $item): bool => $item !== null));
    }
}
