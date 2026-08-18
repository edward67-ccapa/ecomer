<?php

namespace App\Filament\Resources\Monedas\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MonedasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('codigo')
                    ->label('Código')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('nombre')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('simbolo')
                    ->label('Símbolo')
                    ->sortable(),
                IconColumn::make('activa')
                    ->label('Activa')
                    ->boolean()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }
}
