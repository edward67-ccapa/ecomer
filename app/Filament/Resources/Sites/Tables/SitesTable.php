<?php

namespace App\Filament\Resources\Sites\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\Layout;
use Filament\Tables\Table;

class SitesTable
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
                Layout\View::make('filament.tables.cards.site'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->label('Borrar'),
            ]);
    }
}
