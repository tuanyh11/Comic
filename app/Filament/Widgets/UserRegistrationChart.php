<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class UserRegistrationChart extends ChartWidget
{
    protected static ?string $heading = 'Đăng ký người dùng';
    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = $this->getRegistrationData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Đăng ký mới',
                    'data' => $data['counts'],
                    'backgroundColor' => 'rgba(59, 130, 246, 0.5)',
                    'borderColor' => 'rgb(59, 130, 246)',
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
    
    private function getRegistrationData(): array
    {
        // Get data for the last 12 months
        $end = Carbon::now()->endOfMonth();
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        
        // Get all months in the range as labels
        $labels = [];
        $counts = [];
        
        $currentDate = $start->copy();
        while ($currentDate <= $end) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();
            
            $count = User::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            
            $labels[] = $currentDate->format('M Y');
            $counts[] = $count;
            
            $currentDate->addMonth();
        }
        
        return [
            'labels' => $labels,
            'counts' => $counts,
        ];
    }
}