<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['producto_id', 'color_id', 'talla_id', 'nombre', 'slug', 'precio', 'precio_oferta', 'stock', 'imagen', 'orden', 'activa'])]
class Variante extends Model
{
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function talla(): BelongsTo
    {
        return $this->belongsTo(Talla::class);
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
            'activa' => 'bool',
        ];
    }
}
