<?php

namespace App\Filament\Resources\Dominios\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DominioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('Usuario')
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable(),
                TextInput::make('nombre')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255)
                    ->placeholder('creadorDePaginas'),
                Select::make('estado')
                    ->options([
                        'pendiente' => 'Pendiente',
                        'activo' => 'Activo',
                    ])
                    ->default('pendiente')
                    ->required(),
            ]);
    }
}
