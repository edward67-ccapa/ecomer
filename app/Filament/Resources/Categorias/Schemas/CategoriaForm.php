<?php

namespace App\Filament\Resources\Categorias\Schemas;

use App\Models\Categoria;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoriaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)
                    ->schema([
                        Section::make('General')
                            ->icon('heroicon-o-folder')
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
                                        ->preload(),
                                    Select::make('parent_id')
                                        ->label('Categoría padre')
                                        ->options(fn ($get, ?Categoria $record): array => Categoria::query()
                                            ->where('site_id', $get('site_id') ?? $record?->site_id)
                                            ->where('parent_id', null)
                                            ->when($record, fn ($query) => $query->whereKeyNot($record->id))
                                            ->get()
                                            ->mapWithKeys(fn (Categoria $categoria): array => [$categoria->id => $categoria->nombre])
                                            ->all())
                                        ->searchable()
                                        ->placeholder('— sin padre —'),
                                    TextInput::make('orden')
                                        ->numeric()
                                        ->default(0),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                                Textarea::make('descripcion')
                                    ->rows(3),
                                FileUpload::make('imagen')
                                    ->image()
                                    ->directory('categorias'),
                            ])
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
