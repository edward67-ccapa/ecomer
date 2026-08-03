<?php

namespace App\Filament\Resources\Productos\Tables;

use App\Models\Producto;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nombre')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('site.nombre')
                    ->label('Sitio')
                    ->sortable(),
                TextColumn::make('categoria_id')
                    ->label('Categoría')
                    ->formatStateUsing(fn (Producto $record): ?string => $record->subcategoria?->nombre ?? $record->categoria?->nombre),
                TextColumn::make('variantes_count')
                    ->label('Variantes')
                    ->numeric(),
                TextColumn::make('precio')
                    ->money('USD'),
                TextColumn::make('stock')
                    ->numeric(),
                TextColumn::make('activo')
                    ->formatStateUsing(fn ($state) => $state ? '✓ Activo' : '✗ Inactivo'),
            ])
            ->modifyQueryUsing(fn (Builder $query) => $query->with([
                'categoria',
                'subcategoria',
                'site',
                'tiendas',
            ])->withCount('variantes'))
            ->filters([
                SelectFilter::make('site_id')
                    ->label('Sitio')
                    ->relationship('site', 'nombre')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('categoria_id')
                    ->label('Categoría')
                    ->relationship('categoria', 'nombre')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('subcategoria_id')
                    ->label('Subcategoría')
                    ->relationship('subcategoria', 'nombre')
                    ->searchable()
                    ->preload(),
                TernaryFilter::make('activo')
                    ->label('Estado')
                    ->placeholder('Todos')
                    ->trueLabel('Activos')
                    ->falseLabel('Inactivos'),
                TernaryFilter::make('destacado')
                    ->label('Destacados')
                    ->trueLabel('Solo destacados')
                    ->falseLabel('No destacados'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }
}
