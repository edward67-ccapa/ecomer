<?php

namespace App\Filament\Resources\Colores;

use App\Filament\Resources\Colores\Pages\CreateColor;
use App\Filament\Resources\Colores\Pages\EditColor;
use App\Filament\Resources\Colores\Pages\ListColores;
use App\Filament\Resources\Colores\Schemas\ColorForm;
use App\Filament\Resources\Colores\Tables\ColoresTable;
use App\Models\Color;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ColorResource extends Resource
{
    protected static ?string $model = Color::class;

    protected static ?string $slug = 'colores';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSwatch;

    protected static ?string $navigationLabel = 'Colores';

    protected static string|UnitEnum|null $navigationGroup = 'Catálogo';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return ColorForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ColoresTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListColores::route('/'),
            'create' => CreateColor::route('/create'),
            'edit' => EditColor::route('/{record}/edit'),
        ];
    }
}
