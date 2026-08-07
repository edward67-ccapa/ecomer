<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['seccion_id', 'label', 'tipo', 'orden', 'requerida', 'ayuda', 'parent_id', 'estructura', 'max_items'])]
class Pregunta extends Model
{
    public function seccion(): BelongsTo
    {
        return $this->belongsTo(Seccion::class);
    }

    public function respuestas(): HasMany
    {
        return $this->hasMany(Respuesta::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Pregunta::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Pregunta::class, 'parent_id')->orderBy('orden');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requerida' => 'bool',
        ];
    }
}
