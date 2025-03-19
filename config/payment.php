<?php
// config/payment.php

return [
    'vnpay' => [
        'tmn_code' => env('VNPAY_TMN_CODE', 'your_tmn_code'),
        'hash_secret' => env('VNPAY_HASH_SECRET', 'your_hash_secret'),
        'url' => env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
        'return_url' => env('VNPAY_RETURN_URL', default: '/payment/vnpay/return'),
        'api_url' => env('VNPAY_API_URL', 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'),
    ],
    
    'currency_conversion' => [
        'usd_to_vnd' => env('USD_TO_VND_RATE', 23000), // Default conversion rate
    ]
];