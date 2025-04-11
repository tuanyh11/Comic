<?php

namespace App\Filament\Pages;

use App\Filament\Actions\ExportDashboardStatsAction;
use App\Filament\Widgets\PaymentChart;
use App\Filament\Widgets\PaymentStats;
use App\Filament\Widgets\UserRegistrationChart;
use App\Filament\Widgets\UserRegistrationStats;
use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static string $view = 'filament.pages.dashboard';

    protected function getHeaderActions(): array
    {
        return [
            ExportDashboardStatsAction::make()
                ->label('Export Excel')
                ->translateLabel(true),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            PaymentStats::class,
            UserRegistrationStats::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            UserRegistrationChart::class,
            PaymentChart::class,
        ];
    }
}