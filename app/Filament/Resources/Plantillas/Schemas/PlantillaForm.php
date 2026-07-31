<?php

namespace App\Filament\Resources\Plantillas\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PlantillaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)
                    ->schema([
                        Section::make('General')
                            ->icon('heroicon-o-cog')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('nombre')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(ignoreRecord: true)
                                        ->maxLength(255),
                                    Select::make('tipo')
                                        ->options([
                                            'ecommerce' => 'Ecommerce',
                                            'landing_page' => 'Landing Page',
                                        ])
                                        ->default('ecommerce')
                                        ->required(),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                                Textarea::make('descripcion')
                                    ->rows(2),
                                FileUpload::make('imagen')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('plantillas'),
                            ])
                            ->columnSpan(1),
                        
                        Section::make('Estilos globales')
                            ->icon('heroicon-o-paint-brush')
                            ->description('Valores por defecto que copiarán los sites creados con esta plantilla.')
                            ->schema([
                                Grid::make(2)->schema([
                                    ColorPicker::make('estilos.color_primario')
                                        ->label('Color primario'),
                                    ColorPicker::make('estilos.color_secundario')
                                        ->label('Color secundario'),
                                    Select::make('estilos.tipografia_titulos')
                                        ->label('Tipografía para títulos')
                                        ->options(self::fuentes())
                                        ->searchable(),
                                    Select::make('estilos.tipografia_texto')
                                        ->label('Tipografía para texto')
                                        ->options(self::fuentes())
                                        ->searchable(),
                                    TextInput::make('estilos.radio_bordes')
                                        ->label('Radio de bordes')
                                        ->placeholder('0.5rem')
                                        ->helperText('Ejemplo: 0.5rem, 8px, 4px'),
                                    TextInput::make('estilos.espaciado')
                                        ->label('Espaciado general')
                                        ->placeholder('1rem')
                                        ->helperText('Ejemplo: 1rem, 16px, 8px'),
                                ]),
                            ])
                            ->columnSpan(1),
                    ])
                    ->columnSpanFull(),
                
                Section::make('Tiendas')
                    ->icon('heroicon-o-shopping-bag')
                    ->schema([
                        MultiSelect::make('tiendas')
                            ->label('Tiendas asociadas')
                            ->relationship('tiendas', 'nombre')
                            ->searchable()
                            ->preload(),
                    ])
                    ->columnSpanFull(),
                
                Section::make('Secciones')
                    ->icon('heroicon-o-squares-2x2')
                    ->description('Configura las secciones y preguntas de la plantilla')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('secciones')
                            ->relationship()
                            ->label('Secciones de la plantilla')
                            ->reorderableWithDragAndDrop()
                            ->grid(['default' => 1, 'md' => 2])
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('nombre')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('orden')
                                        ->numeric()
                                        ->default(0),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                                Repeater::make('preguntas')
                                    ->relationship()
                                    ->label('Preguntas')
                                    ->reorderableWithDragAndDrop()
                                    ->schema([
                                        Grid::make(5)->schema([
                                            TextInput::make('label')
                                                ->required()
                                                ->maxLength(255)
                                                ->placeholder('portada, titulo1, subtitulo...'),
                                            Select::make('tipo')
                                                ->options(self::tiposPregunta())
                                                ->required()
                                                ->default('texto'),
                                            TextInput::make('orden')
                                                ->numeric()
                                                ->default(0),
                                            Toggle::make('requerida')
                                                ->default(false),
                                            Textarea::make('ayuda')
                                                ->rows(1)
                                                ->columnSpanFull(),
                                        ]),
                                    ])
                                    ->columns(1),
                            ]),
                    ]),
            ]);
    }

    /**
     * @return array<string, string>
     */
    public static function tiposPregunta(): array
    {
        return [
            'texto' => 'Texto',
            'area' => 'Área',
            'imagen' => 'Imagen',
            'galeria' => 'Galería',
            'color' => 'Color',
            'enlace' => 'Enlace',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function fuentes(): array
    {
        return [
            'Inter' => 'Inter',
            'Poppins' => 'Poppins',
            'Roboto' => 'Roboto',
            'Montserrat' => 'Montserrat',
            'Open Sans' => 'Open Sans',
        ];
    }
}