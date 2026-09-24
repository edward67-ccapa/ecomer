<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['titulo', 'slug', 'imagen', 'descripcion', 'orden', 'activa'])]
class Marca extends Model
{
    protected $table = 'marcas';

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class, 'site_marca')->withTimestamps();
    }

    public function plantillas(): BelongsToMany
    {
        return $this->belongsToMany(Plantilla::class, 'plantilla_marca')->withTimestamps();
    }

    /**
     * Accesor para nombre (compatibilidad con componentes que buscan ->nombre).
     */
    public function getNombreAttribute(): ?string
    {
        return $this->titulo;
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
            'activa' => 'boolean',
        ];
    }
}
