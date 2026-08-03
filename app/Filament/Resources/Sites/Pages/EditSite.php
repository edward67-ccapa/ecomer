<?php

namespace App\Filament\Resources\Sites\Pages;

use App\Filament\Resources\Sites\SiteResource;
use App\Models\Respuesta;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSite extends EditRecord
{
    protected static string $resource = SiteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['respuestas'] = $this->record->respuestas
            ->mapWithKeys(fn (Respuesta $respuesta): array => [
                $respuesta->pregunta_id => ['valor' => $respuesta->valor],
            ])
            ->all();

        return $data;
    }

    protected function afterSave(): void
    {
        $this->guardarRespuestas($this->record->id);
    }

    private function guardarRespuestas(int $siteId): void
    {
        $respuestas = $this->form->getState()['respuestas'] ?? [];

        foreach ($respuestas as $preguntaId => $item) {
            $valor = $item['valor'] ?? null;

            // Si es array, convertir a JSON
            if (is_array($valor)) {
                $valor = json_encode($valor);
            }

            Respuesta::updateOrCreate(
                ['site_id' => $siteId, 'pregunta_id' => $preguntaId],
                ['valor' => $valor],
            );
        }
    }
}
