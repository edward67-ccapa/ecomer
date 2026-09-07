<?php

namespace App\Filament\Resources\Servicios\Schemas;

use App\Filament\Forms\Components\IconPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServicioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Información del Grupo de Servicios')
                    ->icon('heroicon-o-wrench-screwdriver')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('nombre')
                                ->label('Nombre del Grupo / Sección')
                                ->placeholder('Ej. Servicios Principales, Servicios Lucha...')
                                ->required()
                                ->maxLength(255),
                            Toggle::make('activo')
                                ->label('Activo')
                                ->default(true),
                        ]),
                    ])
                    ->columnSpanFull(),

                Section::make('Ítems de Servicio')
                    ->description('Agrega uno o múltiples servicios dentro de este grupo usando el botón +')
                    ->icon('heroicon-o-list-bullet')
                    ->schema([
                        Repeater::make('servicios')
                            ->relationship('servicios')
                            ->label('Servicios')
                            ->addActionLabel('+ Agregar servicio')
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['titulo'] ?? 'Nuevo Servicio')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('titulo')
                                        ->label('Título')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('subtitulo')
                                        ->label('Subtítulo')
                                        ->maxLength(255),
                                    TextInput::make('boton')
                                        ->label('Texto del Botón')
                                        ->placeholder('Ej. Ver más / Solicitar')
                                        ->maxLength(255),
                                    TextInput::make('url')
                                        ->label('URL de enlace')
                                        ->placeholder('Ej. /Productos o https://...')
                                        ->maxLength(255),
                                    IconPicker::make('icono')
                                        ->label('Ícono'),
                                    TextInput::make('orden')
                                        ->label('Orden')
                                        ->numeric()
                                        ->default(0),
                                ]),

                                Textarea::make('descripcioncorta')
                                    ->label('Descripción corta')
                                    ->rows(2)
                                    ->columnSpanFull(),

                                Textarea::make('descripcion')
                                    ->label('Descripción completa')
                                    ->rows(4)
                                    ->columnSpanFull(),

                                Textarea::make('lista')
                                    ->label('Lista de elementos (separados por /*/)')
                                    ->placeholder('calidad/*/mejora/*/inversion')
                                    ->helperText('Ingresa los elementos separados por /*/. Ejemplo: calidad/*/mejora/*/inversion. Se mostrará en el frontend como lista: {calidad, mejora, inversion}.')
                                    ->rows(3)
                                    ->columnSpanFull(),

                                FileUpload::make('imagen')
                                    ->label('Imagen del Servicio')
                                    ->directory('servicios')
                                    ->deletable(true)
                                    ->openable()
                                    ->downloadable()
                                    ->columnSpanFull(),

                                Toggle::make('activo')
                                    ->label('Activo')
                                    ->default(true),
                            ])
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}