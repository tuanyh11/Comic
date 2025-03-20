<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class PaymentMethodChart extends ChartWidget
{
    protected static ?string $heading = 'Phương thức thanh toán';
    protected static ?int $sort = 5;

    protected function getData(): array
    {
        $data = $this->getPaymentMethodData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Số lượng giao dịch theo phương thức',
                    'data' => $data['counts'],
                    'backgroundColor' => [
                        'rgba(59, 130, 246, 0.5)', // Blue - Wallet
                        'rgba(234, 88, 12, 0.5)',  // Orange - VNPay
                        'rgba(16, 185, 129, 0.5)', // Green - Credit Card
                        'rgba(107, 114, 128, 0.5)', // Gray - Other
                    ],
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
    
    private function getPaymentMethodData(): array
    {
        // Get data for the current month
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        // Get counts by payment method
        $paymentMethods = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->select('payment_method', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->pluck('count', 'payment_method')
            ->toArray();
        
        // Prepare data for chart
        $labels = [];
        $counts = [];
        
        // Define all possible payment methods
        $allMethods = [
            'wallet' => 'Ví điện tử',
            'vnpay' => 'VNPay',
            'credit_card' => 'Thẻ tín dụng',
            'paypal' => 'PayPal',
            'momo' => 'MoMo',
            'zalopay' => 'ZaloPay',
        ];
        
        // Fill in data for methods that have transactions
        foreach ($allMethods as $method => $label) {
            if (isset($paymentMethods[$method])) {
                $labels[] = $label;
                $counts[] = $paymentMethods[$method];
            }
        }
        
        // Add "Other" category for any methods not in our predefined list
        $otherCount = 0;
        foreach ($paymentMethods as $method => $count) {
            if (!array_key_exists($method, $allMethods)) {
                $otherCount += $count;
            }
        }
        
        if ($otherCount > 0) {
            $labels[] = 'Khác';
            $counts[] = $otherCount;
        }
        
        return [
            'labels' => $labels,
            'counts' => $counts,
        ];
    }
}