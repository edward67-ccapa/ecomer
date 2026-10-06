<?php

namespace App\Filament\Resources\Productos\Pages;

use App\Filament\Resources\Productos\ProductoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProducto extends EditRecord
{
    protected static string $resource = ProductoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $producto = $this->getRecord();
        $producto->load('productoTiendas');

        if ($producto->productoTiendas->isNotEmpty()) {
            $hasNullStock = $producto->productoTiendas->contains(fn ($pt) => is_null($pt->stock));
            $totalStock = $hasNullStock ? null : (int) $producto->productoTiendas->sum('stock');
            $producto->updateQuietly(['stock' => $totalStock]);
        }
    }
}
