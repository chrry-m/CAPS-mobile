<?php

namespace Modules\Users\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Modules\Users\Models\User;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            return $this->handleOAuthUser($googleUser, 'google');
        } catch (\Exception $e) {
            Log::error('Google OAuth error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to authenticate with Google'], 500);
        }
    }

    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->user();
            return $this->handleOAuthUser($facebookUser, 'facebook');
        } catch (\Exception $e) {
            Log::error('Facebook OAuth error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to authenticate with Facebook'], 500);
        }
    }

    private function handleOAuthUser($oauthUser, $provider)
    {
        $providerId = $provider . '_id';
        
        $user = User::where($providerId, $oauthUser->getId())->first();

        if ($user) {
            Auth::login($user);
            $token = $user->createToken('auth-token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ], 200);
        }

        $existingUser = User::where('email', $oauthUser->getEmail())->first();

        if ($existingUser) {
            return response()->json([
                'message' => 'Email already exists',
                'email' => $oauthUser->getEmail(),
                'provider' => $provider
            ], 409);
        }

        return response()->json([
            'message' => 'New user - account creation required',
            'provider' => $provider,
            'email' => $oauthUser->getEmail(),
            'name' => $oauthUser->getName()
        ], 404);
    }

    public function verifyLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'provider' => 'required|in:google,facebook',
            'oauth_token' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $provider = $request->provider;
        $providerId = $provider . '_id';

        if ($user->$providerId) {
            return response()->json(['message' => 'Account already linked'], 400);
        }

        try {
            $oauthUser = Socialite::driver($provider)->userFromToken($request->oauth_token);
            
            $user->$providerId = $oauthUser->getId();
            $user->save();

            Auth::login($user);
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Account linked successfully',
                'user' => $user,
                'token' => $token
            ], 200);
        } catch (\Exception $e) {
            Log::error('Link verification error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to verify OAuth token'], 500);
        }
    }
}