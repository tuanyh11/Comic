import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    BanknoteIcon,
    CreditCard,
    DollarSign,
    HandCoins,
    History,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

const AddFundsPage = () => {
    const { auth, wallet, flash } = usePage().props;
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission through Inertia router
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data } = await axios.post(
                route('payment.vnpay.create-wallet-payment'),
                {
                    amount: amount,
                },
            );

            window.location.href = data.url;
        } catch (error) {
            console.error('Payment error:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <DefaultLayout>
            <Head title="Nạp tiền vào ví" />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Nạp tiền vào ví
                        </h1>
                        <Link
                            href={route('wallet.index')}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại ví
                        </Link>
                    </div>

                    {flash?.error && (
                        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
                            <p>{flash.error}</p>
                        </div>
                    )}

                    {/* Current Balance */}
                    <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-white/90">
                                Số dư hiện tại
                            </h2>
                            <div className="mt-3 flex items-center">
                                <HandCoins className="mr-3 h-10 w-10 text-yellow-300" />
                                <span className="text-4xl font-bold">
                                    {wallet?.balance.toLocaleString() || '0'}
                                </span>
                                <span className="ml-2 text-xl text-white/80">
                                    {wallet?.currency || 'VND'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add Funds with VNPay */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <BanknoteIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Thanh toán với VNPay
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="amount"
                                            className="mb-1 block text-sm font-medium text-gray-700"
                                        >
                                            Số tiền ({wallet.currency})
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <DollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                min="1"
                                                step="1"
                                                value={amount}
                                                onChange={(e) =>
                                                    setAmount(e.target.value)
                                                }
                                                className="block w-full rounded-lg border-gray-300 pl-10 pr-12 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="10,000"
                                                required
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-gray-500 sm:text-sm">
                                                    {wallet.currency}
                                                </span>
                                            </div>
                                        </div>
                                        {amount && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                ={' '}
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                ).format(
                                                    parseFloat(amount),
                                                )}{' '}
                                                {wallet.currency}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {[10000, 50000, 100000].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setAmount(value.toString())
                                                }
                                                className={`rounded-lg border p-3 text-center transition-all ${
                                                    amount === value.toString()
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                            >
                                                {value.toLocaleString()}{' '}
                                                {wallet.currency}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !amount}
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-pink-600 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5" />
                                                Tiến hành thanh toán
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <HandCoins className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Thông tin thanh toán
                                    </h2>
                                </div>

                                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                        <h3 className="font-medium text-gray-800">
                                            Thanh toán an toàn
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Mọi giao dịch đều được bảo mật và mã
                                        hóa. Thông tin thanh toán của bạn không
                                        bao giờ được lưu trữ.
                                    </p>
                                </div>

                                <p className="mb-4 text-gray-600">
                                    VNPay hỗ trợ các phương thức thanh toán sau:
                                </p>
                                <ul className="mb-6 space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Internet Banking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Thẻ ATM / Thẻ ghi nợ nội địa
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Thẻ tín dụng/ghi nợ quốc tế
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Thanh toán QR code
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Ví điện tử
                                    </li>
                                </ul>

                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <p className="text-sm text-gray-700">
                                        Sau khi nhấn nút "Tiến hành thanh toán",
                                        bạn sẽ được chuyển đến cổng thanh toán
                                        an toàn của VNPay để hoàn tất giao dịch.
                                        Sau khi thanh toán thành công, số dư sẽ
                                        được cập nhật ngay lập tức.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Steps */}
                    <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <History className="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Quy trình nạp tiền
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="relative rounded-lg bg-blue-50 p-4">
                                <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                                    1
                                </div>
                                <h3 className="mb-2 mt-2 font-medium text-gray-800">
                                    Nhập số tiền
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Chọn số tiền bạn muốn nạp vào ví của mình
                                </p>
                            </div>

                            <div className="relative rounded-lg bg-blue-50 p-4">
                                <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                                    2
                                </div>
                                <h3 className="mb-2 mt-2 font-medium text-gray-800">
                                    Chọn phương thức
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Chọn ngân hàng hoặc phương thức thanh toán
                                    phù hợp trên VNPay
                                </p>
                            </div>

                            <div className="relative rounded-lg bg-blue-50 p-4">
                                <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                                    3
                                </div>
                                <h3 className="mb-2 mt-2 font-medium text-gray-800">
                                    Hoàn tất
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tiền sẽ được nạp vào ví của bạn ngay sau khi
                                    giao dịch thành công
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AddFundsPage;
