<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'dominio_id', 'plantilla_id', 'nombre', 'slug', 'imagen', 'estado', 'estilos'])]
class Site extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dominio(): BelongsTo
    {
        return $this->belongsTo(Dominio::class);
    }

    public function plantilla(): BelongsTo
    {
        return $this->belongsTo(Plantilla::class);
    }

    public function respuestas(): HasMany
    {
        return $this->hasMany(Respuesta::class);
    }

    public function categorias(): HasMany
    {
        return $this->hasMany(Categoria::class);
    }

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
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
