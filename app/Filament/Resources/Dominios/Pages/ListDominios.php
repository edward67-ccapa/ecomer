<?php

namespace App\Filament\Resources\Dominios\Pages;

use App\Filament\Resources\Dominios\DominioResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDominios extends ListRecords
{
    protected static string $resource = DominioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
