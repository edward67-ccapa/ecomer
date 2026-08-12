<?php

namespace App\Filament\Resources\Plantillas\Tables;

use App\Models\Plantilla;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\Layout;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PlantillasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->selectable(false)
            ->contentGrid([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ])
            ->columns([
                Layout\View::make('filament.tables.cards.plantilla'),
            ])
            ->modifyQueryUsing(fn (Builder $query) => $query
                ->withCount('secciones'))
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('tipo')
                    ->label('Tipo de plantilla')
                    ->options([
                        'ecommerce' => 'Ecommerce',
                        'landing_page' => 'Landing Page',
                        'anuncio' => 'Anuncio / Promoción',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('clonar')
                    ->label('Clonar')
                    ->icon(Heroicon::OutlinedDocumentDuplicate)
                    ->requiresConfirmation()
                    ->action(fn (Model $record) => self::clonar($record)),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }

    private static function clonar(Plantilla $plantilla): void
    {
        $copia = new Plantilla(
            $plantilla->only(['tipo', 'descripcion', 'imagen', 'estilos', 'activa']),
        );

        $copia->slug = Str::slug($plantilla->slug.'-copia');
        $copia->nombre = $plantilla->nombre.' (copia)';
        $copia->save();

        foreach ($plantilla->secciones()->orderBy('orden')->get() as $seccion) {
            $nuevaSeccion = $copia->secciones()->create(
                $seccion->only(['slug', 'nombre', 'orden', 'activa']),
            );

            foreach ($seccion->preguntas()->orderBy('orden')->get() as $pregunta) {
                $nuevaSeccion->preguntas()->create(
                    $pregunta->only(['label', 'tipo', 'orden', 'requerida', 'ayuda']),
                );
            }
        }
    }
}
