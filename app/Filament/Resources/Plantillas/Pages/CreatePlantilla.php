<?php

namespace App\Filament\Resources\Plantillas\Pages;

use App\Filament\Resources\Plantillas\PlantillaResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CreatePlantilla extends CreateRecord
{
    protected static string $resource = PlantillaResource::class;

    protected function afterCreate(): void
    {
        $plantilla = $this->record;
        $studlySlug = Str::studly($plantilla->slug);
        $pathDestino = resource_path("js/pages/sites/{$studlySlug}");

        if (! File::isDirectory($pathDestino)) {
            $basePath = match ($plantilla->tipo) {
                'ecommerce' => resource_path('js/pages/sites/Ecomer1'),
                'landing_page' => resource_path('js/pages/sites/Corporativa'),
                'anuncio' => resource_path('js/pages/sites/Anuncio'),
                default => resource_path('js/pages/sites/Ecomer1'),
            };

            if (File::isDirectory($basePath)) {
                File::copyDirectory($basePath, $pathDestino);

                Notification::make()
                    ->title('Carpeta de Frontend Creada')
                    ->body("Se creó la carpeta de componentes React en: resources/js/pages/sites/{$studlySlug}")
                    ->success()
                    ->send();
            }
        }
    }
}
