<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ProfileService;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Profile service instance
     * 
     * @var ProfileService
     */
    protected $profileService;

    /**
     * Create a new controller instance.
     * 
     * @param ProfileService $profileService
     */
    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Use profile service to handle Google login
            $user = $this->profileService->handleSocialLogin(
                $googleUser->getId(),
                $googleUser->getName(),
                $googleUser->getEmail(),
                $googleUser->getAvatar()
            );

            // If this is a newly created user, fire registered event
            if ($user->wasRecentlyCreated) {
                event(new Registered($user));
            }

            // Login the user
            Auth::login($user);

            // Generate a new session
            request()->session()->regenerate();

            // Redirect to the intended page or dashboard
            return redirect()->intended(route('home', absolute: false));
        } catch (Exception $e) {
            // Log the error and redirect back with an error message
            Log::error('Google login error: ' . $e->getMessage());
            Log::error('Error class: ' . get_class($e));
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect('/login')->with('error', 'Đăng nhập Google không thành công. Vui lòng thử lại sau.');
        }
    }
}