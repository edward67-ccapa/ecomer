<?php

namespace App\Filament\Forms\Components;

use App\Filament\Resources\Plantillas\Schemas\PlantillaForm;
use App\Helpers\IconRegistry;
use Filament\Forms\Components\Field;

class IconPicker extends Field
{
    protected string $view = 'filament.forms.components.icon-picker';

    public function getIconCategories(): array
    {
        return PlantillaForm::getIconOptions();
    }

    public function getIconSvgs(): array
    {
        return IconRegistry::getSvgs();
    }
}
