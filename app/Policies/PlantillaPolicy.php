<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Plantilla;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlantillaPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Plantilla');
    }

    public function view(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('View:Plantilla');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Plantilla');
    }

    public function update(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('Update:Plantilla');
    }

    public function delete(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('Delete:Plantilla');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Plantilla');
    }

    public function restore(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('Restore:Plantilla');
    }

    public function forceDelete(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('ForceDelete:Plantilla');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Plantilla');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Plantilla');
    }

    public function replicate(AuthUser $authUser, Plantilla $plantilla): bool
    {
        return $authUser->can('Replicate:Plantilla');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Plantilla');
    }

}