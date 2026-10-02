<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'dominio_id', 'plantilla_id', 'tienda_id', 'moneda_id', 'nombre', 'slug', 'imagen', 'estado', 'estilos'])]
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

    public function tienda(): BelongsTo
    {
        return $this->belongsTo(Tienda::class);
    }

    public function tiendas(): BelongsToMany
    {
        return $this->belongsToMany(Tienda::class, 'site_tienda')->withTimestamps();
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicios::class, 'site_servicio', 'site_id', 'servicios_id')->withTimestamps();
    }

    public function marcas(): BelongsToMany
    {
        return $this->belongsToMany(Marca::class, 'site_marca')->withTimestamps();
    }

    public function moneda(): BelongsTo
    {
        return $this->belongsTo(Moneda::class);
    }

    public function monedas(): BelongsToMany
    {
        return $this->belongsToMany(Moneda::class, 'moneda_site')->withTimestamps();
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
     * Obtiene los estilos deserializando de forma segura si están en formato string JSON.
     */
    public function getEstilosAttribute(mixed $value): array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                if (is_string($decoded)) {
                    $decoded = json_decode($decoded, true);
                }
                return is_array($decoded) ? $decoded : [];
            }
        }
        return is_array($value) ? $value : [];
    }

    /**
     * Guarda los estilos descartando claves vacías.
     */
    public function setEstilosAttribute(mixed $value): void
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            }
        }

        if (is_array($value)) {
            $this->attributes['estilos'] = json_encode($value);
        } else {
            $this->attributes['estilos'] = $value;
        }
    }
}
