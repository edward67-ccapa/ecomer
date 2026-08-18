<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('monedas')]
#[Fillable(['codigo', 'nombre', 'simbolo', 'activa'])]
class Moneda extends Model
{
    public function tiendas(): BelongsToMany
    {
        return $this->belongsToMany(Tienda::class, 'moneda_tienda')->withTimestamps();
    }

    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class, 'moneda_site')->withTimestamps();
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
