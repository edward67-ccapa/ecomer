<div class="filament-tables-card">
    <div class="filament-tables-card-header">
        <h3 class="filament-tables-card-title">{{ $record->nombre }}</h3>
        <p class="filament-tables-card-subtitle">{{ Str::limit($record->descripcion, 75) }}</p>
    </div>

    <div class="filament-tables-card-content">
        <p class="text-sm text-gray-500">{{ $record->productos_count }} productos</p>
    </div>
</div>
