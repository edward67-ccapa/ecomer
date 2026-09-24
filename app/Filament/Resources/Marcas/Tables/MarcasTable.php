<?php

namespace App\Filament\Resources\Marcas\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MarcasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen')
                    ->label('Imagen / Logo')
                    ->circular(false),
                TextColumn::make('titulo')
                    ->label('Título / Nombre')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('productos_count')
                    ->label('Productos')
                    ->counts('productos')
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
