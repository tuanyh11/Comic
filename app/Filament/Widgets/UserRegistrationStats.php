<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class UserRegistrationStats extends BaseWidget
{
    protected static ?string $pollingInterval = null;
    
    protected function getStats(): array
    {
        // Current month statistics
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        // Previous month for comparison
        $startOfPreviousMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonth()->endOfMonth();
        
        // Count registrations
        $currentMonthRegistrations = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $previousMonthRegistrations = User::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])->count();
        
        // Calculate percentage change
        $percentageChange = 0;
        if ($previousMonthRegistrations > 0) {
            $percentageChange = (($currentMonthRegistrations - $previousMonthRegistrations) / $previousMonthRegistrations) * 100;
        }
        
        // Get daily registrations for the chart
        $dailyRegistrations = $this->getDailyRegistrationsChart();
        
        return [
            Stat::make('Đăng ký trong tháng', $currentMonthRegistrations)
                ->description($percentageChange >= 0 ? 'Tăng ' . number_format(abs($percentageChange), 1) . '%' : 'Giảm ' . number_format(abs($percentageChange), 1) . '%')
                ->descriptionIcon($percentageChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($percentageChange >= 0 ? 'success' : 'danger')
                ->chart($dailyRegistrations),
                
            Stat::make('Tổng người dùng', User::count())
                ->description('Tổng số người dùng đã đăng ký')
                ->color('primary'),
                
            Stat::make('Đăng ký Google', User::whereNotNull('google_id')->count())
                ->description('Đăng nhập qua Google')
                ->color('warning'),
        ];
    }
    
    private function getDailyRegistrationsChart(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        // Create a period for all days in the month
        $period = CarbonPeriod::create($startOfMonth, $endOfMonth);
        
        // Initialize data with zeros for all days
        $chartData = [];
        foreach ($period as $date) {
            $chartData[$date->format('Y-m-d')] = 0;
        }
        
        // Get actual registrations by day
        $dailyRegistrations = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();
        
        // Merge the actual data
        foreach ($dailyRegistrations as $date => $count) {
            $chartData[$date] = $count;
        }
        
        // Format for the chart (last 30 days)
        return array_values(array_slice($chartData, 0, 30));
    }
}