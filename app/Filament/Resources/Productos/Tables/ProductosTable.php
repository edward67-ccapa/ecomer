<?php

namespace App\Filament\Resources\Productos\Tables;

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
                TextColumn::make('categoria.nombre')
                    ->label('Categoría'),
                TextColumn::make('precio')
                    ->money('USD'),
                TextColumn::make('stock')
                    ->numeric(),
                TextColumn::make('activo')
                    ->formatStateUsing(fn ($state) => $state ? '✓ Activo' : '✗ Inactivo'),
            ])
            ->modifyQueryUsing(fn (Builder $query) => $query->with([
                'categoria',
                'site',
                'tiendas',
            ]))
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

