<?php

namespace App\Filament\Resources\Dominios;

use App\Filament\Resources\Dominios\Pages\CreateDominio;
use App\Filament\Resources\Dominios\Pages\EditDominio;
use App\Filament\Resources\Dominios\Pages\ListDominios;
use App\Filament\Resources\Dominios\Schemas\DominioForm;
use App\Filament\Resources\Dominios\Tables\DominiosTable;
use App\Models\Dominio;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class DominioResource extends Resource
{
    protected static ?string $model = Dominio::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeEuropeAfrica;

    protected static ?string $navigationLabel = 'Dominios';

    protected static string|UnitEnum|null $navigationGroup = 'Mis sitios';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return DominioForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DominiosTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDominios::route('/'),
            'create' => CreateDominio::route('/create'),
            'edit' => EditDominio::route('/{record}/edit'),
        ];
    }
}
