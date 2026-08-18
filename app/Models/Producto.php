<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['site_id', 'tienda_id', 'moneda_id', 'categoria_id', 'subcategoria_id', 'nombre', 'slug', 'descripcion', 'precio', 'precio_oferta', 'precio_dolares', 'precio_oferta_dolares', 'precio_euros', 'precio_oferta_euros', 'cantidad', 'stock', 'sku', 'imagen', 'imagenes', 'activo', 'destacado', 'orden'])]
class Producto extends Model
{
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function tienda(): BelongsTo
    {
        return $this->belongsTo(Tienda::class);
    }

    public function moneda(): BelongsTo
    {
        return $this->belongsTo(Moneda::class);
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function subcategoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'subcategoria_id');
    }

    public function variantes(): HasMany
    {
        return $this->hasMany(Variante::class)->orderBy('orden');
    }

    public function tiendas(): BelongsToMany
    {
        return $this->belongsToMany(Tienda::class)->withTimestamps();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'precio_oferta' => 'decimal:2',
            'precio_dolares' => 'decimal:2',
            'precio_oferta_dolares' => 'decimal:2',
            'precio_euros' => 'decimal:2',
            'precio_oferta_euros' => 'decimal:2',
            'imagenes' => 'array',
            'activo' => 'bool',
            'destacado' => 'bool',
        ];
    }
}
