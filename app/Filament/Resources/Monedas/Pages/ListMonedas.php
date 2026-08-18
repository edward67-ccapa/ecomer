<?php

namespace App\Filament\Resources\Monedas\Pages;

use App\Filament\Resources\Monedas\MonedaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMonedas extends ListRecords
{
    protected static string $resource = MonedaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
