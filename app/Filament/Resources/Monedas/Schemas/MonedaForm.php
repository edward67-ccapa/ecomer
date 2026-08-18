<?php

namespace App\Filament\Resources\Monedas\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MonedaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)
                    ->schema([
                        Section::make('General')
                            ->icon('heroicon-o-currency-dollar')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('codigo')
                                        ->label('Código ISO (ej. PEN, USD)')
                                        ->required()
                                        ->maxLength(10),
                                    TextInput::make('nombre')
                                        ->label('Nombre de la moneda')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('simbolo')
                                        ->label('Símbolo (ej. S/, $, €)')
                                        ->required()
                                        ->maxLength(10),
                                ]),
                                Toggle::make('activa')
                                    ->label('Activa')
                                    ->default(true),
                            ])
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
