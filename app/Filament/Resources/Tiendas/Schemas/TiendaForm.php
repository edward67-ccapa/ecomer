<?php

namespace App\Filament\Resources\Tiendas\Schemas;

use App\Models\Tienda;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TiendaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detalles de la tienda')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('nombre')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
                            TextInput::make('slug')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255),
                            TextInput::make('descripcion')
                                ->maxLength(255),
                            MultiSelect::make('monedas')
                                ->label('Monedas Aceptadas')
                                ->relationship('monedas', 'nombre')
                                ->searchable()
                                ->preload(),
                            Toggle::make('estado')
                                ->default(true)
                                ->label('Activa'),
                        ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
