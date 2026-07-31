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

    protected function mutateFormDataUsing(array $data): array
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
            Respuesta::updateOrCreate(
                ['site_id' => $siteId, 'pregunta_id' => $preguntaId],
                ['valor' => $item['valor'] ?? null],
            );
        }
    }
}
