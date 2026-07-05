<?php

namespace App\Http\Controllers\Auth;

use App\Http\Clases\App;
use App\Http\Clases\Mails\MailUtils;
use App\Http\Clases\Respuesta;
use App\Http\Clases\Utils;
use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\PasswordResets;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

/**
 * @group Recuperar Contraseña
 */
class ForgotPasswordController extends Controller
{
    /**
     * Recuperar contraseña
     *
     * Inicia el proceso de recuperar contraseña vía mail. Se enviará un email a la dirección ingresada
     *
     * @bodyParam email string required Email del usuario. Example: nombre@email.com
     */
    public function recover(Request $request)
    {
        $valRules = [
            'email' => 'email|max:300|required|exists:user,email,deleted_at,NULL',
        ];

        //Validar parametros de consulta
        if ($error = $this->validarParametros($request, $valRules)) {
            return response()->json(["message" => $error], 422);
        }

        //Parametros
        $email = strtolower(trim($request->input('email')));

        $objUserBD = User::where('email', $email)
            ->first();

        if (!$objUserBD) {
            $error = __('messages.er_attribute_not_found', ['attribute' => 'Email']);
            return response()->json(["message" => $error], 422);
        }

        //Genera token
        $tokenResetPassword = bin2hex(random_bytes(50));

        $duracionHsToken = App::DURACION_HORAS_TOKEN_RESET_PASSWORD;

        //Fecha de expiracion
        $fechaExpira = Carbon::now()->addHours($duracionHsToken);

        //Guarda el token para recuperar contraseña
        $objPasswordResetBD = PasswordResets::where('email', $email)
            ->first();

        //Si ya existe, actualiza sino inserta
        if ($objPasswordResetBD) {
            $objPasswordResetBD->token = $tokenResetPassword;
            $objPasswordResetBD->token_expiration = $fechaExpira;
            $objPasswordResetBD->save();

        } else {
            $objPasswordResetNuevo = new PasswordResets();
            $objPasswordResetNuevo->email = $email;
            $objPasswordResetNuevo->token = $tokenResetPassword;
            $objPasswordResetNuevo->token_expiration = $fechaExpira;
            $objPasswordResetNuevo->save();
        }

        $personaNombre = $objUserBD->nombre_completo;
        $personaEmail = $objUserBD->email;

        //Genera link
        $linkRecuperar = env('FRONTEND_URL')
            . "/#/recoverPassword"
            . "?token=$tokenResetPassword";

        //Acorta link
        $linkRecuperarCorto = Utils::generarURLCorta($linkRecuperar, false);
        $linkRecuperarCortoURL = $linkRecuperarCorto['url'];

        //Envia mail al usuario
        MailUtils::mailRecuperarPassword(
            $personaEmail,
            $personaNombre,
            $tokenResetPassword,
            $duracionHsToken,
            $linkRecuperarCortoURL
        );

        return response()->json('Ok', 201);
    }

    /**
     * Recuperar contraseña, verifica si es posible recuperar
     *
     * Verifica si es posible recuperar según el token recibido y la fecha de vencimiento de la solicitud
     *
     * @queryParam token string required Token de recuperación de contraseña. Example: Alk34kaSdj12
     */
    public function recoverCheckData(Request $request)
    {
        $valRules = [
            'token' => 'string|required|exists:password_reset_token,token',
        ];

        //Validar parametros de consulta
        if ($error = $this->validarParametros($request, $valRules)) {
            return response()->json(["message" => $error], 422);
        }

        //Parametros
        $token = trim($request->input('token'));

        //Busca token controlando que no este vencido
        $objResetBD = PasswordResets::where('token', $token)
            ->where('token_expiration', ">=", Carbon::now())
            ->orderBy('created_at', 'DESC')
            ->first();

        if (!$objResetBD) {
            $error = __('messages.er_forgot_password_token_expired');
            return response()->json(["message" => $error], 422);
        }

        $objDatos = [
            'email' => $objResetBD->email,
            'token' => $objResetBD->token
        ];

        return response()->json($objDatos, 200);
    }

    /**
     * Recuperar contraseña, registra la nueva contraseña
     *
     * Registra la nueva contraseña validando token y vencimiento
     *
     * @bodyParam token string required Token de recuperación de contraseña. Example: Alk34kaSdj12
     * @bodyParam email string required Email del usuario. Example: nombre@email.com
     * @bodyParam password string required Contraseña (entre 6 y 20 caracteres). Example: 123456
     */
    public function recoverSubmit(Request $request)
    {
        DB::beginTransaction();

        $valRules = [
            'token' => 'string|required|exists:password_reset_token,token',
            'email' => 'email|max:300|required|exists:user,email',
            'password' => 'string|min:6|max:20|required',
        ];

        //Validar parametros de consulta
        if ($error = $this->validarParametros($request, $valRules)) {
            return response()->json(["message" => $error], 422);
        }

        //Parametros
        $token = trim($request->input('token'));
        $email = strtolower(trim($request->input('email')));
        $password = trim($request->input('password'));

        $objUserBD = User::where('email', $email)
            ->first();

        if (!$objUserBD) {
            $error = __('messages.er_attribute_not_found', ['attribute' => 'Email']);
            return response()->json(["message" => $error], 422);
        }

        //Busca token controlando que no este vencido
        $objResetBD = PasswordResets::where('token', $token)
            ->where('token_expiration', ">=", Carbon::now())
            ->orderBy('created_at', 'DESC')
            ->first();

        if (!$objResetBD) {
            $error = __('messages.er_forgot_password_token_expired');
            return response()->json(["message" => $error], 422);
        }

        //Valida longitud de contraseña min y max
        if (strlen($password) < 6 || strlen($password) > 20) {
            $error = __('messages.er_forgot_password_password_length');
            return response()->json(["message" => $error], 422);
        }

        //Actualiza contraseña del usuario
        $objUserBD->password = Hash::make($password);
        $objUserBD->save();

        //Actualiza y limpia los campos de recuperacion de contraseña
        $objResetBD->token_expiration = Carbon::now();  //Le pone la fecha y hora actuales
        $objResetBD->save();

        DB::commit();

        return response()->json('Ok', 200);
    }
}
