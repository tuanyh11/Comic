<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Payment;
use App\Models\WalletTransaction;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalletController extends Controller
{
    protected PaymentService $paymentService;
    
    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
        // Remove middleware from here
    }
    
    /**
     * Display the wallet page with balance and transactions.
     */
    public function index()
    {
        $user = Auth::user();
        $wallet = $user->wallet;
        
        $transactions = [];
        if ($wallet) {
            $transactions = WalletTransaction::where('wallet_id', $wallet->id)
                ->latest()
                ->paginate(10)
                ->through(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'transaction_id' => $transaction->transaction_id,
                        'type' => $transaction->type,
                        'amount' => number_format($transaction->amount, 0, ',', '.') . ' ₫',
                        'balance_before' => number_format($transaction->balance_before, 0, ',', '.') . ' ₫',
                        'balance_after' => number_format($transaction->balance_after, 0, ',', '.') . ' ₫',
                        'description' => $transaction->description,
                        'status' => $transaction->status,
                        'created_at' => $transaction->created_at,
                    ];
                });
        }
        
        // For Inertia:
        return Inertia::render('Wallet/Index', [
            'transactions' => $transactions
        ]);
    }
    
    /**
     * Show the add funds form.
     */
    public function showAddFunds()
    {
        // For Inertia:
        return Inertia::render('Wallet/AddFunds');
    }
    
    /**
     * Process adding funds to wallet.
     */
    public function processAddFunds(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:credit_card,paypal,stripe,vnpay',
        ]);
        
        $user = Auth::user();
        $amount = $request->input('amount');
        $paymentMethod = $request->input('payment_method');
        
        // In a real app, you would integrate with a payment processor here
        // For this example, we'll simulate a successful payment
        
        try {
            $transaction = $this->paymentService->addFunds(
                $user, 
                $amount, 
                $paymentMethod, 
                ['payment_details' => 'Simulated payment']
            );
            
            return redirect()->route('wallet.index')
                ->with('success', "Successfully added " . number_format($amount, 0, ',', '.') . " ₫ to your wallet.");
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Failed to add funds: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Show purchased chapters.
     */
    public function purchasedChapters()
    {
        $user = Auth::user();
        $purchasedChapters = $this->paymentService->getPurchasedChapters($user)
            ->map(function($purchase) {
                return [
                    'id' => $purchase->id,
                    'chapter' => [
                        'id' => $purchase->chapter->id,
                        'title' => $purchase->chapter->title,
                        'comic_id' => $purchase->chapter->comic_id,
                        'comic' => [
                            'id' => $purchase->chapter->comic->id,
                            'title' => $purchase->chapter->comic->title,
                            'slug' => $purchase->chapter->comic->slug,
                        ]
                    ],
                    'price_paid' => number_format($purchase->price_paid, 0, ',', '.') . ' ₫',
                    'purchased_at' => $purchase->created_at->format('Y-m-d H:i:s'),
                ];
            });
        
        // For Inertia:
        return Inertia::render('Wallet/Purchases', [
            'purchasedChapters' => $purchasedChapters
        ]);
    }
}