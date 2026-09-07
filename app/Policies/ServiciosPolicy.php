<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Servicios;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class ServiciosPolicy
{
    use HandlesAuthorization;

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Servicio') || $authUser->can('ViewAny:Servicios') || $authUser->hasRole('super_admin');
    }

    public function view(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('View:Servicio') || $authUser->can('View:Servicios') || $authUser->hasRole('super_admin');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Servicio') || $authUser->can('Create:Servicios') || $authUser->hasRole('super_admin');
    }

    public function update(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('Update:Servicio') || $authUser->can('Update:Servicios') || $authUser->hasRole('super_admin');
    }

    public function delete(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('Delete:Servicio') || $authUser->can('Delete:Servicios') || $authUser->hasRole('super_admin');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Servicio') || $authUser->can('DeleteAny:Servicios') || $authUser->hasRole('super_admin');
    }

    public function restore(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('Restore:Servicio') || $authUser->can('Restore:Servicios') || $authUser->hasRole('super_admin');
    }

    public function forceDelete(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('ForceDelete:Servicio') || $authUser->can('ForceDelete:Servicios') || $authUser->hasRole('super_admin');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Servicio') || $authUser->can('ForceDeleteAny:Servicios') || $authUser->hasRole('super_admin');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Servicio') || $authUser->can('RestoreAny:Servicios') || $authUser->hasRole('super_admin');
    }

    public function replicate(AuthUser $authUser, Servicios $servicios): bool
    {
        return $authUser->can('Replicate:Servicio') || $authUser->can('Replicate:Servicios') || $authUser->hasRole('super_admin');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Servicio') || $authUser->can('Reorder:Servicios') || $authUser->hasRole('super_admin');
    }
}
