<?php

namespace App\Providers;

use App\Filament\Pages\Dashboard;
use Filament\Pages\Dashboard as FilamentDashboard;
use Illuminate\Support\ServiceProvider;

class DashboardServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Replace the default Filament dashboard with our custom one
        // FilamentDashboard::$widget::resolveUsing(fn () => Dashboard::class);
    }
}