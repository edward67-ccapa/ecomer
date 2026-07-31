<?php

namespace App\Filament\Resources\Tiendas\Tables;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class TiendasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nombre')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('descripcion')
                    ->limit(50),
                TextColumn::make('productos_count')
                    ->label('Productos')
                    ->counts('productos'),
                TextColumn::make('estado')
                    ->formatStateUsing(fn ($state) => $state ? '✓ Activa' : '✗ Inactiva'),
            ])
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount('productos'))
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }
}
