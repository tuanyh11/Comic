<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class PaymentChart extends ChartWidget
{
    protected static ?string $heading = 'Thống kê thanh toán';
    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $data = $this->getPaymentData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Doanh thu',
                    'data' => $data['revenue'],
                    'backgroundColor' => 'rgba(34, 197, 94, 0.5)',
                    'borderColor' => 'rgb(34, 197, 94)',
                ],
                [
                    'label' => 'Nạp tiền',
                    'data' => $data['deposits'],
                    'backgroundColor' => 'rgba(251, 191, 36, 0.5)',
                    'borderColor' => 'rgb(251, 191, 36)',
                ]
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
    
    private function getPaymentData(): array
    {
        // Get data for the last 12 months
        $end = Carbon::now()->endOfMonth();
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        
        // Get all months in the range as labels
        $labels = [];
        $revenue = [];
        $deposits = [];
        
        $currentDate = $start->copy();
        while ($currentDate <= $end) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();
            
            // Get revenue from payments
            $monthlyRevenue = Payment::whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('status', 'completed')
                ->sum('amount');
            
            // Get deposits from wallet transactions
            $monthlyDeposits = WalletTransaction::whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('type', 'deposit')
                ->where('status', 'completed')
                ->sum('amount');
            
            $labels[] = $currentDate->format('M Y');
            $revenue[] = $monthlyRevenue;
            $deposits[] = $monthlyDeposits;
            
            $currentDate->addMonth();
        }
        
        return [
            'labels' => $labels,
            'revenue' => $revenue,
            'deposits' => $deposits,
        ];
    }
}