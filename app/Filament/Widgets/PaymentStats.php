<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class PaymentStats extends BaseWidget
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
        
        // Calculate payment statistics
        $currentMonthRevenue = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->sum('amount');
            
        $previousMonthRevenue = Payment::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])
            ->where('status', 'completed')
            ->sum('amount');
            
        // Calculate percentage change for revenue
        $revenuePercentageChange = 0;
        if ($previousMonthRevenue > 0) {
            $revenuePercentageChange = (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100;
        }
        
        // Get wallet deposit statistics
        $currentMonthDeposits = WalletTransaction::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');
            
        $previousMonthDeposits = WalletTransaction::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');
            
        // Calculate percentage change for deposits
        $depositsPercentageChange = 0;
        if ($previousMonthDeposits > 0) {
            $depositsPercentageChange = (($currentMonthDeposits - $previousMonthDeposits) / $previousMonthDeposits) * 100;
        }
        
        // Get daily payments for the chart
        $dailyRevenue = $this->getDailyRevenueChart();
        
        return [
            Stat::make('Doanh thu tháng này', number_format($currentMonthRevenue, 0, ',', '.') . ' ₫')
                ->description($revenuePercentageChange >= 0 ? 'Tăng ' . number_format(abs($revenuePercentageChange), 1) . '%' : 'Giảm ' . number_format(abs($revenuePercentageChange), 1) . '%')
                ->descriptionIcon($revenuePercentageChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenuePercentageChange >= 0 ? 'success' : 'danger')
                ->chart($dailyRevenue),
                
            Stat::make('Nạp tiền tháng này', number_format($currentMonthDeposits, 0, ',', '.') . ' ₫')
                ->description($depositsPercentageChange >= 0 ? 'Tăng ' . number_format(abs($depositsPercentageChange), 1) . '%' : 'Giảm ' . number_format(abs($depositsPercentageChange), 1) . '%')
                ->descriptionIcon($depositsPercentageChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($depositsPercentageChange >= 0 ? 'success' : 'danger'),
                
            Stat::make('Số giao dịch', Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count())
                ->description('Tổng số giao dịch trong tháng')
                ->color('primary'),
        ];
    }
    
    private function getDailyRevenueChart(): array
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
        
        // Get actual revenue by day
        $dailyRevenue = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->pluck('total', 'date')
            ->toArray();
        
        // Merge the actual data
        foreach ($dailyRevenue as $date => $total) {
            $chartData[$date] = $total;
        }
        
        // Format for the chart (last 30 days)
        return array_values(array_slice($chartData, 0, 30));
    }
}