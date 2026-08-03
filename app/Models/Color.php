<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'slug', 'hex', 'orden', 'activa'])]
class Color extends Model
{
    protected $table = 'colores';

    public function variantes(): HasMany
    {
        return $this->hasMany(Variante::class);
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
