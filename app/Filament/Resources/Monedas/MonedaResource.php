<?php

namespace App\Filament\Resources\Monedas;

use App\Filament\Resources\Monedas\Pages\CreateMoneda;
use App\Filament\Resources\Monedas\Pages\EditMoneda;
use App\Filament\Resources\Monedas\Pages\ListMonedas;
use App\Filament\Resources\Monedas\Schemas\MonedaForm;
use App\Filament\Resources\Monedas\Tables\MonedasTable;
use App\Models\Moneda;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class MonedaResource extends Resource
{
    protected static ?string $model = Moneda::class;

    protected static ?string $slug = 'monedas';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCurrencyDollar;

    protected static ?string $navigationLabel = 'Monedas';

    protected static string|UnitEnum|null $navigationGroup = 'Catálogo';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return MonedaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MonedasTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMonedas::route('/'),
            'create' => CreateMoneda::route('/create'),
            'edit' => EditMoneda::route('/{record}/edit'),
        ];
    }
}
