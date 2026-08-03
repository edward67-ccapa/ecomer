<?php

namespace App\Filament\Resources\Productos\Schemas;

use App\Models\Categoria;
use App\Models\Color;
use App\Models\Producto;
use App\Models\Subcategoria;
use App\Models\Talla;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductoForm
{
    public static function configure(Schema $schema): Schema
    {
        $armarVariante = static function (Get $get, Set $set): void {
            $color = Color::find($get('color_id'))?->nombre;
            $talla = Talla::find($get('talla_id'))?->nombre;

            if (blank($color) && blank($talla)) {
                return;
            }

            $nombre = trim(implode(' ', array_filter([$color, $talla])));

            if (filled($nombre)) {
                $set('nombre', $nombre);
                $set('slug', Str::slug($nombre));
            }
        };

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
                            MultiSelect::make('tiendas')
                                ->label('Tiendas')
                                ->relationship('tiendas', 'nombre')
                                ->searchable()
                                ->preload(),
                            Select::make('categoria_id')
                                ->label('Categoría')
                                ->options(fn (Get $get, ?Producto $record): array => Categoria::query()
                                    ->where('site_id', $get('site_id') ?? $record?->site_id)
                                    ->get()
                                    ->mapWithKeys(fn (Categoria $categoria): array => [$categoria->id => $categoria->nombre])
                                    ->all())
                                ->searchable()
                                ->live()
                                ->afterStateUpdated(fn (Set $set) => $set('subcategoria_id', null))
                                ->placeholder('— sin categoría —'),
                            Select::make('subcategoria_id')
                                ->label('Subcategoría')
                                ->options(fn (Get $get, ?Producto $record): array => Subcategoria::query()
                                    ->where('categoria_id', $get('categoria_id') ?? $record?->categoria_id)
                                    ->get()
                                    ->mapWithKeys(fn (Subcategoria $subcategoria): array => [$subcategoria->id => $subcategoria->nombre])
                                    ->all())
                                ->searchable()
                                ->hidden(fn (Get $get) => blank($get('categoria_id')))
                                ->placeholder('— sin subcategoría —'),
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
                Section::make('Variantes')
                    ->icon('heroicon-o-swatch')
                    ->schema([
                        Repeater::make('variantes')
                            ->label('Variantes (color, talla, etc.)')
                            ->relationship('variantes')
                            ->schema([
                                Grid::make(4)->schema([
                                    Select::make('color_id')
                                        ->label('Color')
                                        ->relationship('color', 'nombre')
                                        ->searchable()
                                        ->preload()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated($armarVariante)
                                        ->createOptionForm([
                                            Grid::make(2)->schema([
                                                TextInput::make('nombre')
                                                    ->required()
                                                    ->maxLength(255)
                                                    ->live(onBlur: true)
                                                    ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
                                                TextInput::make('slug')
                                                    ->required()
                                                    ->maxLength(255),
                                                TextInput::make('hex')
                                                    ->label('Código hex')
                                                    ->placeholder('#ffffff'),
                                            ]),
                                        ]),
                                    Select::make('talla_id')
                                        ->label('Talla')
                                        ->relationship('talla', 'nombre')
                                        ->searchable()
                                        ->preload()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated($armarVariante)
                                        ->createOptionForm([
                                            TextInput::make('nombre')
                                                ->required()
                                                ->maxLength(255)
                                                ->live(onBlur: true)
                                                ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
                                            TextInput::make('slug')
                                                ->required()
                                                ->maxLength(255),
                                        ]),
                                    TextInput::make('nombre')
                                        ->helperText('Se compone con color y talla.')
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn (Get $get, Set $set) => $set('slug', Str::slug((string) $get('nombre')))),
                                    TextInput::make('slug'),
                                ]),
                                Grid::make(3)->schema([
                                    TextInput::make('precio')
                                        ->numeric()
                                        ->prefix('$')
                                        ->minValue(0)
                                        ->placeholder('Usa el precio del producto'),
                                    TextInput::make('precio_oferta')
                                        ->label('Precio de oferta')
                                        ->numeric()
                                        ->prefix('$')
                                        ->minValue(0),
                                    TextInput::make('stock')
                                        ->numeric()
                                        ->minValue(0)
                                        ->default(0),
                                ]),
                                Grid::make(2)->schema([
                                    FileUpload::make('imagen')
                                        ->image()
                                        ->directory('variantes'),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                            ])
                            ->defaultItems(0)
                            ->collapsible()
                            ->reorderableWithButtons(),
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
