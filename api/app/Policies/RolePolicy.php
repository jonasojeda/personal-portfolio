<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    use HandlesAuthorization;

    public const PERMISSION_RESOURCE = 'Roles';

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        $accion = 'Ver';
        return $user->hasPermissionTo("$accion " . self::PERMISSION_RESOURCE)
            ? $this->allow()
            : Response::deny(__('messages.er_no_permission'));
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role)
    {
        $accion = 'Ver datos';
        return $user->hasPermissionTo("$accion " . self::PERMISSION_RESOURCE)
            ? $this->allow()
            : Response::deny(__('messages.er_no_permission'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        $accion = 'Crear';
        return $user->hasPermissionTo("$accion " . self::PERMISSION_RESOURCE)
            ? $this->allow()
            : Response::deny(__('messages.er_no_permission'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role)
    {
        $accion = 'Editar';
        return $user->hasPermissionTo("$accion " . self::PERMISSION_RESOURCE)
            ? $this->allow()
            : Response::deny(__('messages.er_no_permission'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role)
    {
        $accion = 'Eliminar';
        return $user->hasPermissionTo("$accion " . self::PERMISSION_RESOURCE)
            ? $this->allow()
            : Response::deny(__('messages.er_no_permission'));
    }

    // /**
    //  * Determine whether the user can restore the model.
    //  */
    // public function restore(User $user, Role $role)
    // {
    //     //
    // }

    // /**
    //  * Determine whether the user can permanently delete the model.
    //  */
    // public function forceDelete(User $user, Role $role)
    // {
    //     //
    // }
}
