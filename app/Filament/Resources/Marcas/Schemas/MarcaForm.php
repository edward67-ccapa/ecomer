<?php

namespace App\Filament\Resources\Marcas\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class MarcaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)
                    ->schema([
                        Section::make('General')
                            ->icon('heroicon-o-tag')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('titulo')
                                        ->label('Título / Nombre')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(ignoreRecord: true)
                                        ->maxLength(255),
                                    TextInput::make('orden')
                                        ->numeric()
                                        ->default(0),
                                    Toggle::make('activa')
                                        ->label('Activa')
                                        ->default(true),
                                ]),
                                Textarea::make('descripcion')
                                    ->label('Descripción')
                                    ->rows(3),
                                FileUpload::make('imagen')
                                    ->label('Imagen / Logo')
                                    ->webp5Mb('marcas'),
                            ])
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
