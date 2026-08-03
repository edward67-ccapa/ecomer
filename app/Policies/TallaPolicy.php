<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Talla;
use Illuminate\Auth\Access\HandlesAuthorization;

class TallaPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Talla');
    }

    public function view(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('View:Talla');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Talla');
    }

    public function update(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('Update:Talla');
    }

    public function delete(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('Delete:Talla');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Talla');
    }

    public function restore(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('Restore:Talla');
    }

    public function forceDelete(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('ForceDelete:Talla');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Talla');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Talla');
    }

    public function replicate(AuthUser $authUser, Talla $talla): bool
    {
        return $authUser->can('Replicate:Talla');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Talla');
    }

}