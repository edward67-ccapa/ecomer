<?php

namespace App\Filament\Resources\Dominios\Pages;

use App\Filament\Resources\Dominios\DominioResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDominio extends EditRecord
{
    protected static string $resource = DominioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
