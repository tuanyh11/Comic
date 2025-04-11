<?php

namespace App\Filament\Actions;

use App\Models\Payment;
use App\Models\User;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Filament\Actions\Action;
use Filament\Actions\Concerns\CanCustomizeProcess as ConcernsCanCustomizeProcess;
use Filament\Support\Actions\Concerns\CanCustomizeProcess;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;

class ExportDashboardStatsAction extends Action
{
    use ConcernsCanCustomizeProcess;

    public static function getDefaultName(): ?string
    {
        return 'exportDashboardStats';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Xuất thống kê');
        $this->icon('heroicon-o-document-arrow-down');
        $this->color('success');

        $this->action(function () {
            try {
                // Tạo spreadsheet mới
                $spreadsheet = new Spreadsheet();
                
                // Tạo sheet cho Payment Stats
                $paymentSheet = $spreadsheet->getActiveSheet();
                $paymentSheet->setTitle('Thống kê thanh toán');
                
                // Tạo sheet cho User Registration Stats
                $userSheet = $spreadsheet->createSheet();
                $userSheet->setTitle('Thống kê người dùng');
                
                // Thêm dữ liệu thanh toán
                $this->addPaymentStats($paymentSheet);
                
                // Thêm dữ liệu người dùng
                $this->addUserStats($userSheet);
                
                // Tạo file Excel và tải xuống
                $writer = new Xlsx($spreadsheet);
                // Quan trọng: Bật chức năng bao gồm biểu đồ
                $writer->setIncludeCharts(true);
                
                $filename = 'thong-ke-dashboard-' . time() . '.xlsx';
                $tempPath = storage_path('app/public/' . $filename);
                $writer->save($tempPath);
                
                return response()->download($tempPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ])->deleteFileAfterSend();
            } catch (\Exception $e) {
                // Ghi log lỗi để debug
                Log::error('Export dashboard error: ' . $e->getMessage());
                Log::error($e->getTraceAsString());
                throw $e;
            }
        });
    }
    
    protected function addPaymentStats($sheet): void
    {
        // Thông tin hiện tại và tháng trước
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfPreviousMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonth()->endOfMonth();
        
        // Thiết lập header chính
        $sheet->setCellValue('A1', 'Thống kê thanh toán - ' . $now->format('m/Y'));
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        
        // Tạo dữ liệu doanh thu theo ngày cho biểu đồ đầu tiên
        $dailyRevenueData = $this->prepareDailyRevenueData($startOfMonth, $endOfMonth);
        $dailyDataStartRow = 3;
        $dailyDataEndRow = $this->addDataTable($sheet, 'F', $dailyRevenueData['labels'], $dailyRevenueData['data'], 
            ['Ngày', 'Doanh thu'], $dailyDataStartRow);
        
        // Thêm biểu đồ doanh thu theo ngày - đặt ở đầu trang
        $dailyRevenueChart = $this->createDailyRevenueChart($sheet, $dailyDataStartRow, $dailyDataEndRow);
        $dailyRevenueChart->setTopLeftPosition('A3');
        $dailyRevenueChart->setBottomRightPosition('E18');
        $sheet->addChart($dailyRevenueChart);
        
        // Tạo dữ liệu doanh thu theo tháng cho biểu đồ thứ hai
        $monthlyData = $this->prepareMonthlyRevenueData();
        $monthlyDataStartRow = 20;
        $monthlyDataEndRow = $this->addDataTable($sheet, 'F', $monthlyData['labels'], 
            [$monthlyData['revenue'], $monthlyData['deposits']], 
            ['Tháng', 'Doanh thu', 'Nạp tiền'], $monthlyDataStartRow);
        
        // Format tiền tệ cho dữ liệu doanh thu tháng
        $sheet->getStyle('G' . ($monthlyDataStartRow + 1) . ':H' . $monthlyDataEndRow)
            ->getNumberFormat()->setFormatCode('#,##0 VND');
        
        // Thêm biểu đồ doanh thu và nạp tiền theo tháng - đặt ở dưới biểu đồ đầu tiên
        $monthlyRevenueChart = $this->createMonthlyRevenueChart($sheet, $monthlyDataStartRow, $monthlyDataEndRow);
        $monthlyRevenueChart->setTopLeftPosition('A20');
        $monthlyRevenueChart->setBottomRightPosition('E35');
        $sheet->addChart($monthlyRevenueChart);
        
        // Thêm bảng thống kê ở phía dưới biểu đồ
        $statsRow = 38;
        $sheet->setCellValue('A' . $statsRow, 'Chỉ số');
        $sheet->setCellValue('B' . $statsRow, 'Giá trị hiện tại');
        $sheet->setCellValue('C' . $statsRow, 'Giá trị tháng trước');
        $sheet->setCellValue('D' . $statsRow, '% Thay đổi');
        $sheet->getStyle('A' . $statsRow . ':D' . $statsRow)->getFont()->setBold(true);
        
        // Tính toán doanh thu
        $currentMonthRevenue = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->sum('amount');
            
        $previousMonthRevenue = Payment::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])
            ->where('status', 'completed')
            ->sum('amount');
        
        // Tính toán tiền nạp
        $currentMonthDeposits = WalletTransaction::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');
            
        $previousMonthDeposits = WalletTransaction::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');
        
        // Tính phần trăm thay đổi
        $revenuePercentageChange = ($previousMonthRevenue > 0)
            ? (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 0;
            
        $depositsPercentageChange = ($previousMonthDeposits > 0)
            ? (($currentMonthDeposits - $previousMonthDeposits) / $previousMonthDeposits) * 100
            : 0;
            
        // Số giao dịch
        $transactionCount = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        
        // Thêm dữ liệu thanh toán
        $sheet->setCellValue('A' . ($statsRow + 1), 'Doanh thu');
        $sheet->setCellValue('B' . ($statsRow + 1), $currentMonthRevenue);
        $sheet->setCellValue('C' . ($statsRow + 1), $previousMonthRevenue);
        $sheet->setCellValue('D' . ($statsRow + 1), number_format($revenuePercentageChange, 2) . '%');
        
        $sheet->setCellValue('A' . ($statsRow + 2), 'Nạp tiền');
        $sheet->setCellValue('B' . ($statsRow + 2), $currentMonthDeposits);
        $sheet->setCellValue('C' . ($statsRow + 2), $previousMonthDeposits);
        $sheet->setCellValue('D' . ($statsRow + 2), number_format($depositsPercentageChange, 2) . '%');
        
        $sheet->setCellValue('A' . ($statsRow + 3), 'Số giao dịch');
        $sheet->setCellValue('B' . ($statsRow + 3), $transactionCount);
        $sheet->setCellValue('C' . ($statsRow + 3), '');
        $sheet->setCellValue('D' . ($statsRow + 3), '');
        
        // Format tiền tệ
        $sheet->getStyle('B' . ($statsRow + 1) . ':C' . ($statsRow + 2))->getNumberFormat()->setFormatCode('#,##0 VND');
        
        // Auto-fit columns
        foreach(range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    }
    
    protected function addUserStats($sheet): void
    {
        // Thông tin hiện tại và tháng trước
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfPreviousMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonth()->endOfMonth();
        
        // Thiết lập header chính
        $sheet->setCellValue('A1', 'Thống kê người dùng - ' . $now->format('m/Y'));
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        
        // Tạo dữ liệu đăng ký theo ngày cho biểu đồ đầu tiên
        $dailyRegistrationData = $this->prepareDailyRegistrationData($startOfMonth, $endOfMonth);
        $dailyDataStartRow = 3;
        $dailyDataEndRow = $this->addDataTable($sheet, 'F', $dailyRegistrationData['labels'], $dailyRegistrationData['data'], 
            ['Ngày', 'Đăng ký mới'], $dailyDataStartRow);
        
        // Thêm biểu đồ đăng ký theo ngày - đặt ở đầu trang
        $dailyRegistrationChart = $this->createDailyRegistrationChart($sheet, $dailyDataStartRow, $dailyDataEndRow);
        $dailyRegistrationChart->setTopLeftPosition('A3');
        $dailyRegistrationChart->setBottomRightPosition('E18');
        $sheet->addChart($dailyRegistrationChart);
        
        // Tạo dữ liệu đăng ký theo tháng cho biểu đồ thứ hai
        $monthlyData = $this->prepareMonthlyRegistrationData();
        $monthlyDataStartRow = 20;
        $monthlyDataEndRow = $this->addDataTable($sheet, 'F', $monthlyData['labels'], [$monthlyData['data']], 
            ['Tháng', 'Đăng ký mới'], $monthlyDataStartRow);
        
        // Thêm biểu đồ đăng ký theo tháng - đặt ở dưới biểu đồ đầu tiên
        $monthlyRegistrationChart = $this->createMonthlyRegistrationChart($sheet, $monthlyDataStartRow, $monthlyDataEndRow);
        $monthlyRegistrationChart->setTopLeftPosition('A20');
        $monthlyRegistrationChart->setBottomRightPosition('E35');
        $sheet->addChart($monthlyRegistrationChart);
        
        // Thêm bảng thống kê ở phía dưới biểu đồ
        $statsRow = 38;
        $sheet->setCellValue('A' . $statsRow, 'Chỉ số');
        $sheet->setCellValue('B' . $statsRow, 'Giá trị hiện tại');
        $sheet->setCellValue('C' . $statsRow, 'Giá trị tháng trước');
        $sheet->setCellValue('D' . $statsRow, '% Thay đổi');
        $sheet->getStyle('A' . $statsRow . ':D' . $statsRow)->getFont()->setBold(true);
        
        // Tính toán đăng ký người dùng
        $currentMonthRegistrations = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $previousMonthRegistrations = User::whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth])->count();
        
        // Tính phần trăm thay đổi
        $percentageChange = ($previousMonthRegistrations > 0)
            ? (($currentMonthRegistrations - $previousMonthRegistrations) / $previousMonthRegistrations) * 100
            : 0;
            
        // Tổng số người dùng
        $totalUsers = User::count();
        
        // Đăng ký qua Google
        $googleUsers = User::whereNotNull('google_id')->count();
        
        // Thêm dữ liệu người dùng
        $sheet->setCellValue('A' . ($statsRow + 1), 'Đăng ký trong tháng');
        $sheet->setCellValue('B' . ($statsRow + 1), $currentMonthRegistrations);
        $sheet->setCellValue('C' . ($statsRow + 1), $previousMonthRegistrations);
        $sheet->setCellValue('D' . ($statsRow + 1), number_format($percentageChange, 2) . '%');
        
        $sheet->setCellValue('A' . ($statsRow + 2), 'Tổng người dùng');
        $sheet->setCellValue('B' . ($statsRow + 2), $totalUsers);
        $sheet->setCellValue('C' . ($statsRow + 2), '');
        $sheet->setCellValue('D' . ($statsRow + 2), '');
        
        $sheet->setCellValue('A' . ($statsRow + 3), 'Đăng ký Google');
        $sheet->setCellValue('B' . ($statsRow + 3), $googleUsers);
        $sheet->setCellValue('C' . ($statsRow + 3), '');
        $sheet->setCellValue('D' . ($statsRow + 3), '');
        
        // Auto-fit columns
        foreach(range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    }
    
    /**
     * Thêm bảng dữ liệu vào sheet
     */
    protected function addDataTable($sheet, $startColumn, $labels, $dataSeries, $headers, $startRow)
    {
        // Tính toán cột bắt đầu
        $currentColumn = $startColumn;
        
        // Thêm headers
        for ($i = 0; $i < count($headers); $i++) {
            $sheet->setCellValue($currentColumn . $startRow, $headers[$i]);
            $currentColumn++;
        }
        
        // Đặt style cho headers
        $endHeaderColumn = chr(ord($startColumn) + count($headers) - 1);
        $sheet->getStyle($startColumn . $startRow . ':' . $endHeaderColumn . $startRow)
            ->getFont()->setBold(true);
        
        // Thêm dữ liệu
        $row = $startRow + 1;
        foreach ($labels as $i => $label) {
            // Đặt lại cột về vị trí bắt đầu cho mỗi dòng mới
            $currentColumn = $startColumn;
            
            // Thêm label
            $sheet->setCellValue($currentColumn . $row, $label);
            $currentColumn++;
            
            // Thêm data series
            foreach ($dataSeries as $data) {
                $value = isset($data[$i]) ? $data[$i] : 0;
                $sheet->setCellValue($currentColumn . $row, $value);
                $currentColumn++;
            }
            
            $row++;
        }
        
        return $row - 1; // Trả về chỉ số dòng cuối cùng
    }
    
    /**
     * Chuẩn bị dữ liệu doanh thu theo ngày
     */
    protected function prepareDailyRevenueData($startOfMonth, $endOfMonth)
    {
        $period = CarbonPeriod::create($startOfMonth, $endOfMonth);
        $labels = [];
        
        // Lấy dữ liệu doanh thu theo ngày
        $dailyRevenue = Payment::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->pluck('total', 'date')
            ->toArray();
        
        $data = [];
        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $labels[] = $date->format('d/m/Y');
            $data[] = $dailyRevenue[$dateString] ?? 0;
        }
        
        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }
    
    /**
     * Chuẩn bị dữ liệu doanh thu theo tháng
     */
    protected function prepareMonthlyRevenueData()
    {
        $end = Carbon::now()->endOfMonth();
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        
        $currentDate = $start->copy();
        $labels = [];
        $revenueData = [];
        $depositData = [];
        
        while ($currentDate <= $end) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();
            
            // Lấy doanh thu từ payments
            $monthlyRevenue = Payment::whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('status', 'completed')
                ->sum('amount');
            
            // Lấy tiền nạp từ wallet transactions
            $monthlyDeposits = WalletTransaction::whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('type', 'deposit')
                ->where('status', 'completed')
                ->sum('amount');
            
            $labels[] = $currentDate->format('m/Y');
            $revenueData[] = $monthlyRevenue;
            $depositData[] = $monthlyDeposits;
            
            $currentDate->addMonth();
        }
        
        return [
            'labels' => $labels,
            'revenue' => $revenueData,
            'deposits' => $depositData,
        ];
    }
    
    /**
     * Chuẩn bị dữ liệu đăng ký theo ngày
     */
    protected function prepareDailyRegistrationData($startOfMonth, $endOfMonth)
    {
        $period = CarbonPeriod::create($startOfMonth, $endOfMonth);
        $labels = [];
        
        // Lấy dữ liệu đăng ký theo ngày
        $dailyRegistrations = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();
        
        $data = [];
        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $labels[] = $date->format('d/m/Y');
            $data[] = $dailyRegistrations[$dateString] ?? 0;
        }
        
        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }
    
    /**
     * Chuẩn bị dữ liệu đăng ký theo tháng
     */
    protected function prepareMonthlyRegistrationData()
    {
        $end = Carbon::now()->endOfMonth();
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        
        $currentDate = $start->copy();
        $labels = [];
        $registrationData = [];
        
        while ($currentDate <= $end) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();
            
            $count = User::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            
            $labels[] = $currentDate->format('m/Y');
            $registrationData[] = $count;
            
            $currentDate->addMonth();
        }
        
        return [
            'labels' => $labels,
            'data' => $registrationData,
        ];
    }
    
    /**
     * Tạo biểu đồ doanh thu theo ngày
     */
    protected function createDailyRevenueChart($sheet, $startRow, $endRow)
    {
        $dataSeriesLabels = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!G" . $startRow, 
                null, 
                1
            ),
        ];
        
        $dataSeriesValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER, 
                "'" . $sheet->getTitle() . "'!G" . ($startRow + 1) . ":G" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!F" . ($startRow + 1) . ":F" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $series = new DataSeries(
            DataSeries::TYPE_LINECHART,
            DataSeries::GROUPING_STANDARD,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues
        );
        
        $plotArea = new PlotArea(null, [$series]);
        $legend = new Legend(Legend::POSITION_RIGHT, null, false);
        $title = new Title('Doanh thu theo ngày trong tháng ' . Carbon::now()->format('m/Y'));
        
        return new Chart(
            'chart1',
            $title,
            $legend,
            $plotArea,
            true,
            0,
            null,
            null
        );
    }
    
    /**
     * Tạo biểu đồ doanh thu và nạp tiền theo tháng
     */
    protected function createMonthlyRevenueChart($sheet, $startRow, $endRow)
    {
        $dataSeriesLabels = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!G" . $startRow, 
                null, 
                1
            ),
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!H" . $startRow, 
                null, 
                1
            ),
        ];
        
        $dataSeriesValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER, 
                "'" . $sheet->getTitle() . "'!G" . ($startRow + 1) . ":G" . $endRow, 
                null, 
                $endRow - $startRow
            ),
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER, 
                "'" . $sheet->getTitle() . "'!H" . ($startRow + 1) . ":H" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!F" . ($startRow + 1) . ":F" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $series = new DataSeries(
            DataSeries::TYPE_BARCHART,
            DataSeries::GROUPING_CLUSTERED,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues
        );
        
        $plotArea = new PlotArea(null, [$series]);
        $legend = new Legend(Legend::POSITION_RIGHT, null, false);
        $title = new Title('Doanh thu và nạp tiền theo tháng');
        
        return new Chart(
            'chart2',
            $title,
            $legend,
            $plotArea,
            true,
            0,
            null,
            null
        );
    }
    
    /**
     * Tạo biểu đồ đăng ký theo ngày
     */
    protected function createDailyRegistrationChart($sheet, $startRow, $endRow)
    {
        $dataSeriesLabels = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!G" . $startRow, 
                null, 
                1
            ),
        ];
        
        $dataSeriesValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER, 
                "'" . $sheet->getTitle() . "'!G" . ($startRow + 1) . ":G" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!F" . ($startRow + 1) . ":F" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $series = new DataSeries(
            DataSeries::TYPE_LINECHART,
            DataSeries::GROUPING_STANDARD,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues
        );
        
        $plotArea = new PlotArea(null, [$series]);
        $legend = new Legend(Legend::POSITION_RIGHT, null, false);
        $title = new Title('Đăng ký người dùng theo ngày trong tháng ' . Carbon::now()->format('m/Y'));
        
        return new Chart(
            'chart3',
            $title,
            $legend,
            $plotArea,
            true,
            0,
            null,
            null
        );
    }
    
    /**
     * Tạo biểu đồ đăng ký theo tháng
     */
    protected function createMonthlyRegistrationChart($sheet, $startRow, $endRow)
    {
        $dataSeriesLabels = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!G" . $startRow, 
                null, 
                1
            ),
        ];
        
        $dataSeriesValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER, 
                "'" . $sheet->getTitle() . "'!G" . ($startRow + 1) . ":G" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING, 
                "'" . $sheet->getTitle() . "'!F" . ($startRow + 1) . ":F" . $endRow, 
                null, 
                $endRow - $startRow
            ),
        ];
        
        $series = new DataSeries(
            DataSeries::TYPE_BARCHART,
            DataSeries::GROUPING_STANDARD,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues
        );
        
        $plotArea = new PlotArea(null, [$series]);
        $legend = new Legend(Legend::POSITION_RIGHT, null, false);
        $title = new Title('Đăng ký người dùng theo tháng');
        
        return new Chart(
            'chart4',
            $title,
            $legend,
            $plotArea,
            true,
            0,
            null,
            null
        );
    }
}