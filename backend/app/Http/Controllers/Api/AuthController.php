<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:40'],
            'group_name' => ['required', 'in:DEV201,DEV202'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            ...$payload,
            'role' => 'student',
            'password' => Hash::make($payload['password']),
        ]);

        return response()->json([
            'message' => 'Inscription réussie.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'expected_role' => ['nullable', 'in:student,teacher,developer'],
        ]);

        $user = User::where('email', $payload['email'])->first();

        if (!$user || !Hash::check($payload['password'], $user->password)) {
            return response()->json(['message' => 'incorrect'], 422);
        }

        if (!empty($payload['expected_role']) && $user->role !== $payload['expected_role']) {
            return response()->json(['message' => 'Profil non autorisé pour cette page de connexion.'], 403);
        }

        $token = $user->createToken('app-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $payload['email'])
            ->where('first_name', $payload['first_name'])
            ->where('last_name', $payload['last_name'])
            ->where('phone', $payload['phone'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Informations non valides.'], 422);
        }

        return response()->json([
            'message' => 'Identité validée.',
            'reset_email' => $user->email,
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::where('email', $payload['email'])->firstOrFail();
        $user->update(['password' => Hash::make($payload['password'])]);

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }
}
