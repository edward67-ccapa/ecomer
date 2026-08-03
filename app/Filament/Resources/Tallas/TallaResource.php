<?php

namespace App\Filament\Resources\Tallas;

use App\Filament\Resources\Tallas\Pages\CreateTalla;
use App\Filament\Resources\Tallas\Pages\EditTalla;
use App\Filament\Resources\Tallas\Pages\ListTallas;
use App\Filament\Resources\Tallas\Schemas\TallaForm;
use App\Filament\Resources\Tallas\Tables\TallasTable;
use App\Models\Talla;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TallaResource extends Resource
{
    protected static ?string $model = Talla::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedViewColumns;

    protected static ?string $navigationLabel = 'Tallas';

    protected static string|UnitEnum|null $navigationGroup = 'Catálogo';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return TallaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TallasTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTallas::route('/'),
            'create' => CreateTalla::route('/create'),
            'edit' => EditTalla::route('/{record}/edit'),
        ];
    }
}
