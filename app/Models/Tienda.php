<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['nombre', 'slug', 'descripcion', 'estado', 'moneda_id'])]
class Tienda extends Model
{
    public function moneda(): BelongsTo
    {
        return $this->belongsTo(Moneda::class);
    }

    public function monedas(): BelongsToMany
    {
        return $this->belongsToMany(Moneda::class, 'moneda_tienda')->withTimestamps();
    }
    public function plantillas(): BelongsToMany
    {
        return $this->belongsToMany(Plantilla::class);
    }

    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Producto::class)->withTimestamps();
    }

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    public function categorias(): HasMany
    {
        return $this->hasMany(Categoria::class);
    }
}
