<?php

namespace App\Filament\Resources\Sites\Pages;

use App\Filament\Resources\Sites\SiteResource;
use App\Models\Plantilla;
use App\Models\Respuesta;
use Filament\Resources\Pages\CreateRecord;

class CreateSite extends CreateRecord
{
    protected static string $resource = SiteResource::class;

    public function mount(): void
    {
        parent::mount();

        if ($plantillaId = request()->query('plantilla_id')) {
            $plantilla = Plantilla::find($plantillaId);

            if ($plantilla) {
                $this->form->fill([
                    'plantilla_id' => $plantilla->id,
                    'estilos' => $plantilla->estilos,
                ]);
            }
        }
    }

    protected function afterCreate(): void
    {
        $this->guardarRespuestas($this->record->id);
    }

    private function guardarRespuestas(int $siteId): void
    {
        $respuestas = $this->form->getState()['respuestas'] ?? [];

        foreach ($respuestas as $preguntaId => $item) {
            Respuesta::updateOrCreate(
                ['site_id' => $siteId, 'pregunta_id' => $preguntaId],
                ['valor' => $item['valor'] ?? null],
            );
        }
    }
}
