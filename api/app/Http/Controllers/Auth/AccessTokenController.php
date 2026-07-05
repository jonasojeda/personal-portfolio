<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Request;

/**
 * @group Autenticación
 * @subgroup Tokens de acceso (móvil)
 */
class AccessTokenController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['except' => ['store']]);
    }

    /**
     * Mostrar los tokens de acceso
     *
     * Muestra los tokens de acceso del usuario actual.
     */
    public function index()
    {
        return Request::user()->tokens;
    }

    /**
     * Crear un token de acceso (login)
     *
     * Crea un token de acceso para el usuario actual.
     *
     * @bodyParam username string required Nombre de usuario. Example: superadmin1
     * @bodyParam password string required Contraseña del usuario. Example: 1234
     */
    public function store(LoginRequest $request)
    {
        //Verificar Existencia de corrego
        if ($request->email && !User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email no registrado',
            ], 404);
        }

        $request->authenticate();

        //Elimina todos los token viejos, para que solo sea valido el que se crea en esta petición
        //$request->user()->tokens()->delete();

        //Nuevo token
        $token = $request->user()->createToken('auth_token');
        return response()->json([
            'tokenType' => 'Bearer',
            'accessToken' => $token->plainTextToken,
            'user' => $request->user()->obtenerObjDatosSesion()
        ]);
    }

    /**
     * Eliminar el token de acceso (logout)
     *
     * Elimina el token de acceso usado para la autenticación.
     */
    public function destroy()
    {
        //Request::user()->currentAccessToken()->delete();
        if (method_exists(auth()->user()->currentAccessToken(), 'delete')) {
            auth()->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sesión cerrada',
        ], 200);
    }

    /**
     * Eliminar todos los tokens de acceso
     *
     * Elimina todos los tokens de acceso del usuario actual. Equivale a cerrar todas las sesiones del usuario actual.
     */
    public function destroyAll()
    {
        Request::user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesiones cerradas',
        ], 200);
    }
}
