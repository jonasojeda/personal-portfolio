<?php

namespace Database\Seeders;

use App\Policies\RolePolicy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        //Rol
        $resource = RolePolicy::PERMISSION_RESOURCE;
        $permisos = collect([
            ["name" => "Ver $resource"],
            ["name" => "Ver datos $resource"],
            ["name" => "Crear $resource"],
            ["name" => "Editar $resource"],
            ["name" => "Eliminar $resource"],
        ]);
        $permisos->each(function ($permiso) use ($resource) {
            $permiso['group'] = $resource;
            Permission::firstOrCreate(['name' => $permiso['name'], 'guard_name' => 'web'], $permiso);
        });
        Role::findByName(RoleSeeder::ROL_SUPERADMINISTRADOR)->givePermissionTo($permisos);

    }
}
