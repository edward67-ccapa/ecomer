<?php

namespace App\Filament\Resources\Categorias\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CategoriasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nombre')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('subcategorias_count')
                    ->label('Subcategorías')
                    ->counts('subcategorias')
                    ->sortable(),
                TextColumn::make('productos_count')
                    ->label('Productos')
                    ->counts('productos')
                    ->sortable(),
                TextColumn::make('site.nombre')
                    ->label('Sitio')
                    ->searchable()
                    ->sortable(),
                IconColumn::make('activa')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('orden')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }
}
