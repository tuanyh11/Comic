<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\Payment;
use App\Models\PurchasedChapter;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Add funds to a user's wallet.
     *
     * @param User $user
     * @param float $amount
     * @param string $paymentMethod
     * @param array $metadata
     * @return WalletTransaction
     */
    public function addFunds(User $user, float $amount, string $paymentMethod, array $metadata = []): WalletTransaction
    {
        return DB::transaction(function () use ($user, $amount, $paymentMethod, $metadata) {
            // Get or create wallet
            $wallet = $user->wallet ?? Wallet::create(['user_id' => $user->id, 'balance' => 0]);
            
            $balanceBefore = $wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            if($wallet->currency) {
                
            }
            
            // Update wallet balance
            $wallet->balance = $balanceAfter;
            $wallet->save();

            info($wallet);
            
            // Create transaction record
            return WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'user_id' => $user->id,
                'transaction_id' => $this->generateTransactionId(),
                'type' => 'deposit',
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => 'Funds added via ' . $paymentMethod,
                'status' => 'completed',
                'metadata' => $metadata,
            ]);
        });
    }
    
    /**
     * Purchase a chapter using wallet balance.
     *
     * @param User $user
     * @param Chapter $chapter
     * @return PurchasedChapter
     * @throws \Exception
     */
    public function purchaseChapter(User $user, Chapter $chapter): PurchasedChapter
    {
        // Check if the chapter is already purchased
        if ($user->hasPurchased($chapter)) {
            throw new \Exception('Chapter already purchased');
        }
        
        // Check if the chapter has a price
        if (!$chapter->isPaidContent()) {
            throw new \Exception('Chapter is free content');
        }
        
        return DB::transaction(function () use ($user, $chapter) {
            // Get wallet or create if not exists
            $wallet = $user->wallet ?? Wallet::create(['user_id' => $user->id, 'balance' => 0]);
            
            // Check if user has enough balance
            if ($wallet->balance < $chapter->pricing) {
                throw new \Exception('Insufficient funds');
            }
            
            $balanceBefore = $wallet->balance;
            $balanceAfter = $balanceBefore - $chapter->pricing;
            
            // Update wallet balance
            $wallet->balance = $balanceAfter;
            $wallet->save();
            
            // Create transaction record
            $transaction = WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'user_id' => $user->id,
                'transaction_id' => $this->generateTransactionId(),
                'type' => 'purchase',
                'amount' => -$chapter->pricing,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => 'Purchase of chapter: ' . $chapter->title,
                'status' => 'completed',
                'metadata' => [
                    'chapter_id' => $chapter->id,
                    'comic_id' => $chapter->comic_id,
                ],
            ]);
            
            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'transaction_id' => $transaction->transaction_id,
                'payment_method' => 'wallet',
                'amount' => $chapter->pricing,
                'currency' => $wallet->currency,
                'status' => 'completed',
                'metadata' => [
                    'wallet_transaction_id' => $transaction->id,
                ],
            ]);
            
            // Record the purchase
            return PurchasedChapter::create([
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'price_paid' => $chapter->pricing,
                'payment_id' => $payment->id,
            ]);
        });
    }
    
    /**
     * Purchase a chapter directly with a payment gateway.
     *
     * @param User $user
     * @param Chapter $chapter
     * @param string $paymentMethod
     * @param string $gatewayTransactionId
     * @param array $metadata
     * @return PurchasedChapter
     * @throws \Exception
     */
    public function purchaseChapterDirect(
        User $user, 
        Chapter $chapter, 
        string $paymentMethod, 
        string $gatewayTransactionId, 
        array $metadata = []
    ): PurchasedChapter {
        // Check if the chapter is already purchased
        if ($user->hasPurchased($chapter)) {
            throw new \Exception('Chapter already purchased');
        }
        
        // Check if the chapter has a price
        if (!$chapter->isPaidContent()) {
            throw new \Exception('Chapter is free content');
        }
        
        return DB::transaction(function () use ($user, $chapter, $paymentMethod, $gatewayTransactionId, $metadata) {
            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'transaction_id' => $gatewayTransactionId,
                'payment_method' => $paymentMethod,
                'amount' => $chapter->pricing,
                'currency' => 'VND', // Or use a config value
                'status' => 'completed',
                'metadata' => $metadata,
            ]);
            
            // Record the purchase
            return PurchasedChapter::create([
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'price_paid' => $chapter->pricing,
                'payment_id' => $payment->id,
            ]);
        });
    }
    
    /**
     * Get a user's wallet balance.
     *
     * @param User $user
     * @return float
     */
    public function getWalletBalance(User $user): float
    {
        $wallet = $user->wallet;
        
        if (!$wallet) {
            return 0.0;
        }
        
        return (float) $wallet->balance;
    }
    
    /**
     * Get a user's purchased chapters.
     *
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPurchasedChapters(User $user)
    {
        return $user->purchasedChapters()->with('chapter')->get();
    }
    
    /**
     * Check if a user has purchased a chapter.
     *
     * @param User $user
     * @param Chapter $chapter
     * @return bool
     */
    public function hasUserPurchased(User $user, Chapter $chapter): bool
    {
        return $user->hasPurchased($chapter);
    }
    
    /**
     * Generate a unique transaction ID.
     *
     * @return string
     */
    private function generateTransactionId(): string
    {
        return 'TRX-' . strtoupper(Str::random(16));
    }
}