<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Dominio;
use Illuminate\Auth\Access\HandlesAuthorization;

class DominioPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Dominio');
    }

    public function view(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('View:Dominio');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Dominio');
    }

    public function update(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('Update:Dominio');
    }

    public function delete(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('Delete:Dominio');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Dominio');
    }

    public function restore(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('Restore:Dominio');
    }

    public function forceDelete(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('ForceDelete:Dominio');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Dominio');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Dominio');
    }

    public function replicate(AuthUser $authUser, Dominio $dominio): bool
    {
        return $authUser->can('Replicate:Dominio');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Dominio');
    }

}