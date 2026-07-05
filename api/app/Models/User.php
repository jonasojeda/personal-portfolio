<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    //Funciones publicas
    public function obtenerObjDatos(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'timezone' => $this->timezone,
            'verificacionEmail' => $this->email_verified_at,
            'creado' => $this->created_at,
            'roles' => $this->roles->map->only('id', 'name'),
            'permisos' => $this->getAllPermissions()->pluck('name'),
            'empleado' => $this->empleado?->obtenerObjDatosSimple(),
            'cliente' => $this->cliente?->obtenerObjDatosSimple(),
        ];
    }

    public function obtenerObjDatosSesion(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'timezone' => $this->timezone,
            'verificacionEmail' => $this->email_verified_at,
            'creado' => $this->created_at,
            'roles' => $this->roles->map->only('id', 'name'),
            'permisos' => $this->getAllPermissions()->pluck('name'),
            'cliente' => $this->cliente?->obtenerObjDatosSimple(),
        ];
    }

    public function obtenerObjDatosSimple(): array
    {
        return [
            'id' => $this->id,
            'clienteID' => $this->cliente_id,
            'username' => $this->username,
            'email' => $this->email,
            'timezone' => $this->timezone,
            'creado' => $this->created_at,
        ];
    }

    //Relaciones
    public function Rol()
    {
        return $this->hasMany('App\Models\ModelHasRoles', 'model_id', 'id')
            ->where('model_has_roles.model_type', '=', 'App\\Models\\User')
            ->withTrashed()
            ->select('rol_id AS rolID', 'model_type AS modelType', 'model_id AS modelID');
    }
}
