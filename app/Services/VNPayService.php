<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class VNPayService
{
    protected $vnp_TmnCode;
    protected $vnp_HashSecret;
    protected $vnp_Url;
    protected $vnp_ReturnUrl;
    protected $vnp_Version;
    protected $vnp_Command;
    protected $vnp_CurrCode;
    protected $vnp_Locale;

    public function __construct()
    {
        $this->vnp_TmnCode = config('payment.vnpay.tmn_code');
        $this->vnp_HashSecret = config('payment.vnpay.hash_secret');
        $this->vnp_Url = config('payment.vnpay.url');
        $this->vnp_ReturnUrl = config('payment.vnpay.return_url');
        $this->vnp_Version = "2.1.0";
        $this->vnp_Command = "pay";
        $this->vnp_CurrCode = "VND";
        $this->vnp_Locale = "vn";
    }

    /**
     * Create payment URL for adding funds to wallet
     *
     * @param User $user
     * @param float $amount
     * @param string $orderType
     * @return string
     */
    public function createPaymentUrlForWallet(User $user, float $amount, string $orderType = 'topup'): string
    {
        $vnp_OrderInfo = 'Top-up wallet for user: ' . $user->id;
        $vnp_OrderType = $orderType;
        $vnp_TxnRef = $this->generateTransactionRef();
        $vnp_Amount = $amount * 100; // Convert to VND (no decimal)
        $vnp_IpAddr = request()->ip();
        
        // Store transaction info in session
        session([
            'vnpay_transaction' => [
                'user_id' => $user->id,
                'amount' => $amount,
                'transaction_ref' => $vnp_TxnRef,
                'type' => 'wallet_topup',
                'created_at' => now()
            ]
        ]);
        
        return $this->createPaymentUrl($vnp_TxnRef, $vnp_Amount, $vnp_OrderInfo, $vnp_OrderType, $vnp_IpAddr);
    }

    /**
     * Create payment URL for purchasing a chapter
     *
     * @param User $user
     * @param Chapter $chapter
     * @return string
     */
    public function createPaymentUrlForChapter(User $user, Chapter $chapter): string
    {
        $vnp_OrderInfo = 'Purchase chapter ' . $chapter->id . ' for user: ' . $user->id;
        $vnp_OrderType = 'purchase';
        $vnp_TxnRef = $this->generateTransactionRef();
        $vnp_Amount = $chapter->pricing * 100 * 23000; // Convert to VND (assuming price is in USD)
        $vnp_IpAddr = request()->ip();
        
        // Store transaction info in session
        session([
            'vnpay_transaction' => [
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'amount' => $chapter->pricing,
                'transaction_ref' => $vnp_TxnRef,
                'type' => 'chapter_purchase',
                'created_at' => now()
            ]
        ]);
        
        return $this->createPaymentUrl($vnp_TxnRef, $vnp_Amount, $vnp_OrderInfo, $vnp_OrderType, $vnp_IpAddr);
    }

    /**
     * Create payment URL
     *
     * @param string $vnp_TxnRef
     * @param int $vnp_Amount
     * @param string $vnp_OrderInfo
     * @param string $vnp_OrderType
     * @param string $vnp_IpAddr
     * @return string
     */
    private function createPaymentUrl($vnp_TxnRef, $vnp_Amount, $vnp_OrderInfo, $vnp_OrderType, $vnp_IpAddr): string
    {
        $inputData = [
            "vnp_Version" => $this->vnp_Version,
            "vnp_TmnCode" => $this->vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => $this->vnp_Command,
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => $this->vnp_CurrCode,
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $this->vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $this->vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $this->vnp_Url . "?" . $query;
        
        if (isset($this->vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        
        return $vnp_Url;
    }

    /**
     * Process VNPay response
     *
     * @param Request $request
     * @return array
     */
    public function processReturnUrl(Request $request): array
    {
        $vnp_ResponseCode = $request->vnp_ResponseCode;
        $vnp_TxnRef = $request->vnp_TxnRef;
        $vnp_Amount = $request->vnp_Amount / 100; // Convert back from VND format
        $vnp_TransactionNo = $request->vnp_TransactionNo;
        $vnp_BankCode = $request->vnp_BankCode;
        
        // Verify hash signature
        $inputData = [];
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $hashData = "";
        $i = 0;
        
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }
        
        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);
        
        // Check if transaction is valid
        if ($secureHash != $request->vnp_SecureHash) {
            return [
                'success' => false,
                'message' => 'Invalid signature',
                'code' => 'INVALID_SIGNATURE'
            ];
        }
        
        // Get transaction info from session
        $transaction = session('vnpay_transaction');
        if (!$transaction || $transaction['transaction_ref'] !== $vnp_TxnRef) {
            return [
                'success' => false,
                'message' => 'Transaction not found or mismatched',
                'code' => 'TRANSACTION_NOT_FOUND'
            ];
        }
        
        // Check if payment is successful
        if ($vnp_ResponseCode != '00') {
            return [
                'success' => false,
                'message' => 'Payment failed with code: ' . $vnp_ResponseCode,
                'code' => 'PAYMENT_FAILED',
                'transaction' => $transaction,
                'response_code' => $vnp_ResponseCode
            ];
        }
        
        return [
            'success' => true,
            'message' => 'Payment successful',
            'transaction' => $transaction,
            'vnp_response' => [
                'amount' => $vnp_Amount,
                'transaction_no' => $vnp_TransactionNo,
                'bank_code' => $vnp_BankCode
            ]
        ];
    }

    /**
     * Generate transaction reference
     *
     * @return string
     */
    private function generateTransactionRef(): string
    {
        return date('YmdHis') . Str::random(6);
    }
}