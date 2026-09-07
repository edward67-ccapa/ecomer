<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'nombre',
    'activo',
])]
class Servicios extends Model
{
    protected $table = 'servicios';

    /**
     * Cargar automáticamente la relación HasMany con los servicios individuales.
     */
    protected $with = [
        'servicios',
    ];

    public function servicios(): HasMany
    {
        return $this->hasMany(Servicio::class, 'servicios_id')->orderBy('orden');
    }

    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class, 'site_servicio', 'servicios_id', 'site_id')->withTimestamps();
    }

    public function plantillas(): BelongsToMany
    {
        return $this->belongsToMany(Plantilla::class, 'plantilla_servicio', 'servicios_id', 'plantilla_id')->withTimestamps();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }
}
