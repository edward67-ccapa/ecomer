<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Tienda;
use Illuminate\Auth\Access\HandlesAuthorization;

class TiendaPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Tienda');
    }

    public function view(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('View:Tienda');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Tienda');
    }

    public function update(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('Update:Tienda');
    }

    public function delete(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('Delete:Tienda');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Tienda');
    }

    public function restore(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('Restore:Tienda');
    }

    public function forceDelete(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('ForceDelete:Tienda');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Tienda');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Tienda');
    }

    public function replicate(AuthUser $authUser, Tienda $tienda): bool
    {
        return $authUser->can('Replicate:Tienda');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Tienda');
    }

}