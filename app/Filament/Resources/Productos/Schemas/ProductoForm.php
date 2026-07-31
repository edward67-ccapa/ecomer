<?php

namespace App\Filament\Resources\Productos\Schemas;

use App\Models\Categoria;
use App\Models\Producto;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General')
                    ->icon('heroicon-o-shopping-bag')
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
                            Select::make('site_id')
                                ->label('Sitio')
                                ->relationship('site', 'nombre')
                                ->required()
                                ->searchable()
                                ->preload()
                                ->live(),
                            Select::make('categoria_id')
                                ->label('Categoría')
                                ->options(fn ($get, ?Producto $record): array => Categoria::query()
                                    ->where('site_id', $get('site_id') ?? $record?->site_id)
                                    ->get()
                                    ->mapWithKeys(fn (Categoria $categoria): array => [$categoria->id => $categoria->nombre])
                                    ->all())
                                ->searchable()
                                ->placeholder('— sin categoría —'),
                            TextInput::make('sku')
                                ->label('SKU')
                                ->maxLength(255),
                            TextInput::make('orden')
                                ->numeric()
                                ->default(0),
                            Grid::make(2)->schema([
                                Toggle::make('activo')
                                    ->default(true),
                                Toggle::make('destacado')
                                    ->label('Destacado')
                                    ->default(false),
                            ]),
                        ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Precio y stock')
                    ->icon('heroicon-o-currency-dollar')
                    ->columns(2)
                    ->schema([
                        TextInput::make('precio')
                            ->numeric()
                            ->required()
                            ->prefix('$')
                            ->minValue(0),
                        TextInput::make('precio_oferta')
                            ->label('Precio de oferta')
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        TextInput::make('cantidad')
                            ->helperText('Cantidad por unidad de venta, p. ej. 500 g')
                            ->maxLength(255),
                        TextInput::make('stock')
                            ->numeric()
                            ->required()
                            ->minValue(0)
                            ->default(0),
                    ])
                    ->columnSpanFull(),
                Section::make('Imágenes')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        FileUpload::make('imagen')
                            ->label('Imagen principal')
                            ->image()
                            ->directory('productos')
                            ->columnSpan(2),
                        FileUpload::make('imagenes')
                            ->label('Galería')
                            ->multiple()
                            ->image()
                            ->directory('productos')
                            ->columnSpanFull(),
                    ])
                    ->columns(4)
                    ->columnSpanFull(),
                Section::make('Descripción')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Textarea::make('descripcion')
                            ->rows(4),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
