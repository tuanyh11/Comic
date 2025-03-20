<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\PaymentStats;
use App\Filament\Widgets\UserRegistrationStats;
use App\Models\User;
use App\Models\Payment;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget\Card;
use Filament\Support\Colors\Color;
use Filament\Widgets\StatsOverviewWidget;
use Illuminate\Support\Facades\DB;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected function getHeaderWidgets(): array
    {
        return [
            UserRegistrationStats::class,
            PaymentStats::class,
        ];
    }

    // protected function getColumns(): int
    // {
    //     return 2;
    // }
}