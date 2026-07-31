<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['nombre', 'slug', 'descripcion', 'estado'])]
class Tienda extends Model
{
    public function plantillas(): BelongsToMany
    {
        return $this->belongsToMany(Plantilla::class);
    }

    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Producto::class)->withTimestamps();
    }
}
