<?php

namespace App\Filament\Resources\Monedas\Pages;

use App\Filament\Resources\Monedas\MonedaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMoneda extends EditRecord
{
    protected static string $resource = MonedaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
