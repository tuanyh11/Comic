import DefaultLayout from '@/Layouts/DefaultLayout';
import { LaravelPagination, Transaction } from '@/types/custom';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    BanknoteIcon,
    Calendar,
    CreditCard,
    DollarSign,
    HandCoins,
    PlusCircle,
    ShoppingCart,
} from 'lucide-react';
import { FC, useState } from 'react';

const WalletPage: FC<{ transactions: LaravelPagination<Transaction> }> = ({
    transactions,
}) => {
    const { wallet } = usePage().props;
    const [amount, setAmount] = useState('');

    // Function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Function to get transaction icon based on type
    const getTransactionIcon = (
        type: 'deposit' | 'withdrawal' | 'purchase',
    ) => {
        switch (type) {
            case 'deposit':
                return <ArrowDownCircle className="h-6 w-6 text-green-500" />;
            case 'withdrawal':
                return <ArrowUpCircle className="h-6 w-6 text-red-500" />;
            case 'purchase':
                return <ShoppingCart className="h-6 w-6 text-blue-500" />;
            default:
                return <DollarSign className="h-6 w-6 text-gray-500" />;
        }
    };

    return (
        <DefaultLayout>
            <Head title="Ví của tôi" />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:mb-0">
                            Ví của tôi
                        </h1>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
                        >
                            <ArrowUpCircle className="h-4 w-4" />
                            Quay lại trang chủ
                        </Link>
                    </div>

                    {/* Wallet Overview */}
                    <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-lg">
                        <div className="px-6 py-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-6 md:mb-0">
                                    <h2 className="text-xl font-semibold text-white/90">
                                        Số dư hiện tại
                                    </h2>
                                    <div className="mt-3 flex items-center">
                                        <HandCoins className="mr-3 h-10 w-10 text-yellow-300" />
                                        <span className="text-4xl font-bold">
                                            {wallet?.balance.toLocaleString() ||
                                                '0'}
                                        </span>
                                        <span className="ml-2 text-xl text-white/80">
                                            {wallet?.currency || 'VND'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 md:flex md:space-x-3 md:space-y-0">
                                    <Link
                                        href={route('wallet.add-funds')}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-blue-700 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg md:w-auto"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Nạp tiền
                                    </Link>

                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-md backdrop-blur-sm transition-all hover:bg-white/20 md:w-auto">
                                        <CreditCard className="h-4 w-4" />
                                        Rút tiền
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="rounded-full bg-blue-600/40 p-3">
                                        <ArrowDownCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Tổng nạp
                                        </p>
                                        <p className="text-lg font-bold text-white">
                                            120,000 VND
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="rounded-full bg-pink-600/40 p-3">
                                        <ShoppingCart className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Tổng chi tiêu
                                        </p>
                                        <p className="text-lg font-bold text-white">
                                            45,000 VND
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="rounded-full bg-yellow-600/40 p-3">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Lần nạp gần nhất
                                        </p>
                                        <p className="text-lg font-bold text-white">
                                            15/03/2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Funds Form with VNPay */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg md:col-span-2">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <BanknoteIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Nạp tiền với VNPay
                                    </h2>
                                </div>

                                <form
                                    action={route(
                                        'payment.vnpay.create-wallet-payment',
                                    )}
                                    method="POST"
                                    className="space-y-4"
                                >
                                    <input type="hidden" name="_token" />

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
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-pink-600"
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        Thanh toán với VNPay
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
                                        Giới thiệu VNPay
                                    </h2>
                                </div>
                                <p className="mb-4 text-gray-600">
                                    VNPay là dịch vụ thanh toán hàng đầu tại
                                    Việt Nam, cho phép bạn thanh toán qua nhiều
                                    phương thức:
                                </p>
                                <ul className="mb-4 list-disc space-y-1 pl-5 text-gray-600">
                                    <li>Internet Banking</li>
                                    <li>Thẻ ATM / Thẻ ghi nợ nội địa</li>
                                    <li>Thẻ tín dụng/ghi nợ quốc tế</li>
                                    <li>Thanh toán QR code</li>
                                    <li>Ví điện tử</li>
                                </ul>
                                <p className="rounded-lg bg-yellow-50 p-3 text-gray-600">
                                    Sau khi nhấn nút "Thanh toán", bạn sẽ được
                                    chuyển đến cổng thanh toán an toàn của VNPay
                                    để hoàn tất giao dịch.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                        <div className="border-b border-gray-200 p-6">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Lịch sử giao dịch
                                </h2>
                            </div>

                            {transactions && transactions.data.length > 0 ? (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                >
                                                    Loại
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                >
                                                    Mô tả
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                >
                                                    Số tiền
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                >
                                                    Ngày
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {transactions.data.map(
                                                (transaction) => (
                                                    <tr
                                                        key={transaction.id}
                                                        className="transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center">
                                                                {getTransactionIcon(
                                                                    transaction.type,
                                                                )}
                                                                <span className="ml-2 text-sm font-medium text-gray-900">
                                                                    {transaction.type ===
                                                                    'deposit'
                                                                        ? 'Nạp tiền'
                                                                        : transaction.type ===
                                                                            'withdrawal'
                                                                          ? 'Rút tiền'
                                                                          : 'Mua hàng'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {
                                                                transaction.description
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span
                                                                className={`font-medium ${parseFloat(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                                            >
                                                                {parseFloat(
                                                                    transaction.amount,
                                                                ) >= 0
                                                                    ? '+'
                                                                    : ''}
                                                                {
                                                                    transaction.amount
                                                                }{' '}
                                                                {wallet?.currency ||
                                                                    'VND'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {formatDate(
                                                                transaction.created_at,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-lg bg-blue-50 p-8 text-center">
                                    <p className="text-gray-600">
                                        Chưa có giao dịch nào. Hãy nạp tiền để
                                        bắt đầu!
                                    </p>
                                    <Link
                                        href={route('wallet.add-funds')}
                                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Nạp tiền ngay
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default WalletPage;
