<?php

namespace App\Filament\Pages;

use App\Filament\Actions\ExportDashboardStatsAction;
use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static string $view = 'filament.pages.dashboard';

    protected function getHeaderActions(): array
    {
        return [
            ExportDashboardStatsAction::make()
                ->label('Xuất Excel có biểu đồ'),
        ];
    }
}
