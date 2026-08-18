<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['site_id', 'tienda_id', 'nombre', 'slug', 'descripcion', 'imagen', 'orden', 'activa'])]
class Categoria extends Model
{
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function tienda(): BelongsTo
    {
        return $this->belongsTo(Tienda::class);
    }

    public function subcategorias(): HasMany
    {
        return $this->hasMany(Subcategoria::class)->orderBy('orden');
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
            'activa' => 'bool',
        ];
    }
}
