<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Subcategoria;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubcategoriaPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Subcategoria');
    }

    public function view(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('View:Subcategoria');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Subcategoria');
    }

    public function update(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('Update:Subcategoria');
    }

    public function delete(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('Delete:Subcategoria');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Subcategoria');
    }

    public function restore(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('Restore:Subcategoria');
    }

    public function forceDelete(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('ForceDelete:Subcategoria');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Subcategoria');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Subcategoria');
    }

    public function replicate(AuthUser $authUser, Subcategoria $subcategoria): bool
    {
        return $authUser->can('Replicate:Subcategoria');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Subcategoria');
    }

}