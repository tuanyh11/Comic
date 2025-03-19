<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Payment;
use App\Models\PurchasedChapter;
use App\Services\PaymentService;
use App\Services\VNPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VNPayController extends Controller
{
    protected VNPayService $vnpayService;
    protected PaymentService $paymentService;
    
    public function __construct(VNPayService $vnpayService, PaymentService $paymentService)
    {
        $this->vnpayService = $vnpayService;
        $this->paymentService = $paymentService;
        // $this->middleware('auth');
    }
    
    /**
     * Create payment URL for adding funds to wallet
     */
    public function createPaymentForWallet(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);
        $user = Auth::user();
        $amount = $request->input('amount');
        
        try {
            $paymentUrl = $this->vnpayService->createPaymentUrlForWallet($user, $amount);
            return response()->json([
                'url' => $paymentUrl
            ]);
        } catch (\Exception $e) {
            Log::error('VNPay payment creation failed: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Failed to create payment: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Create payment URL for purchasing a chapter
     */
    public function createPaymentForChapter(Request $request, Chapter $chapter)
    {
        $user = Auth::user();
        
        // Check if chapter is purchasable
        if (!$chapter->isPaidContent()) {
            return redirect()->back()->with('error', 'This chapter is free content.');
        }
        
        // Check if already purchased
        if ($this->paymentService->hasUserPurchased($user, $chapter)) {
            return redirect()->route('chapters.show', $chapter)
                ->with('info', 'You already own this chapter.');
        }
        
        try {
            $paymentUrl = $this->vnpayService->createPaymentUrlForChapter($user, $chapter);
            return redirect($paymentUrl);
        } catch (\Exception $e) {
            Log::error('VNPay chapter payment creation failed: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Failed to create payment: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Handle the return from VNPay
     */
    public function handleReturnUrl(Request $request)
    {
        $result = $this->vnpayService->processReturnUrl($request);
        
        if (!$result['success']) {
            Log::error('VNPay payment failed: ' . $result['message'], $result);
            return redirect()->route('payment.failed')->with('error', $result['message']);
        }
        
        $transaction = $result['transaction'];
        $user = Auth::user();
        
        // Process based on transaction type
        if ($transaction['type'] === 'wallet_topup') {
            try {
                // Add funds to wallet
                $this->paymentService->addFunds(
                    $user,
                    $transaction['amount'],
                    'vnpay', 
                    [
                        'vnp_transaction_no' => $result['vnp_response']['transaction_no'] ?? null,
                        'vnp_bank_code' => $result['vnp_response']['bank_code'] ?? null,
                        'vnp_transaction_ref' => $transaction['transaction_ref'],
                    ]
                );
                
                // Clear session
                session()->forget('vnpay_transaction');
                return redirect()->route('wallet.index')
                    ->with('success', 'Successfully added funds to your wallet.');
            } catch (\Exception $e) {
                Log::error('Failed to add funds after VNPay success: ' . $e->getMessage());
                return redirect()->route('Wallet/index')
                    ->with('error', 'Payment was successful but we encountered an error adding funds. Please contact support.');
            }
        } elseif ($transaction['type'] === 'chapter_purchase') {
            try {
                $chapter = Chapter::findOrFail($transaction['chapter_id']);
                
                // Record direct purchase
                $this->paymentService->purchaseChapterDirect(
                    $user,
                    $chapter,
                    'vnpay',
                    $transaction['transaction_ref'],
                    [
                        'vnp_transaction_no' => $result['vnp_response']['transaction_no'] ?? null,
                        'vnp_bank_code' => $result['vnp_response']['bank_code'] ?? null,
                    ]
                );
                
                // Clear session
                session()->forget('vnpay_transaction');
                
                return redirect()->route('chapters.show', $chapter)
                    ->with('success', 'Successfully purchased the chapter!');
            } catch (\Exception $e) {
                Log::error('Failed to record chapter purchase after VNPay success: ' . $e->getMessage());
                return redirect()->route('comics.index')
                    ->with('error', 'Payment was successful but we encountered an error recording your purchase. Please contact support.');
            }
        }
        
        return redirect()->route('home')
            ->with('warning', 'Payment was successful but the transaction type is unknown.');
    }
    
    /**
     * Show payment failed page
     */
    public function showFailedPage()
    {
        return view('payment.failed');
    }

    public function showSuccessPage()
    {
        return Inertia::render('Payment/Success');
    }
}