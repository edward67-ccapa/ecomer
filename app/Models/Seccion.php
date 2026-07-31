<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('secciones')]
#[Fillable(['plantilla_id', 'slug', 'nombre', 'orden', 'activa'])]
class Seccion extends Model
{
    public function plantilla(): BelongsTo
    {
        return $this->belongsTo(Plantilla::class);
    }

    public function preguntas(): HasMany
    {
        return $this->hasMany(Pregunta::class)->orderBy('orden');
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
