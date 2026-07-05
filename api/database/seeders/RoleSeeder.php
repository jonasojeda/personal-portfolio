<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public const ROL_SUPERADMINISTRADOR = "Super Admin";
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Super Admin',
        ];

        foreach ($roles as $rol) {
            if (!Role::where('name', $rol)->exists()) {
                Role::create([
                    'name' => $rol,
                    'guard_name' => 'web'
                ]);
            }
        }
    }
}
