<?php

namespace App\Filament\Pages\Auth;

use Filament\Actions\Action;
use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Schemas\Components\Component;
use Illuminate\Contracts\Support\Htmlable;

class Login extends BaseLogin
{

    protected function getEmailFormComponent(): Component
    {
        return parent::getEmailFormComponent()
            ->label('Correo electrónico');
    }

    protected function getPasswordFormComponent(): Component
    {
        return parent::getPasswordFormComponent()
            ->label('Contraseña');
    }

    protected function getRememberFormComponent(): Component
    {
        return parent::getRememberFormComponent()
            ->label('Recordarme');
    }

    protected function getAuthenticateFormAction(): Action
    {
        return parent::getAuthenticateFormAction()
            ->label('Entrar');
    }
}
