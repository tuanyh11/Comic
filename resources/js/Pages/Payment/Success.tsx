import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    Eye,
    HandCoins,
    Receipt,
} from 'lucide-react';
import { useEffect } from 'react';

interface Transaction {
    transaction_ref: string;
    bank_code?: string;
    amount: string;
    currency?: string;
    created_at: string;
    type: string;
    chapter_title?: string;
    comic_slug?: string;
    chapter_id?: number;
}

const PaymentSuccessPage = () => {
    const { transaction, auth, flash } = usePage<{ transaction: Transaction }>()
        .props;

    // Hiệu ứng confetti khi trang load
    useEffect(() => {
        // Nếu có thư viện confetti, bạn có thể thêm vào đây
        // Ví dụ: import confetti from 'canvas-confetti';
        // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, []);

    return (
        <DefaultLayout>
            <Head title="Thanh toán thành công" />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-pink-500 py-10 text-white">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <h1 className="mt-6 text-3xl font-bold">
                                Thanh toán thành công!
                            </h1>
                            <p className="mt-2 text-lg text-white/90">
                                Giao dịch của bạn đã được xử lý thành công.
                            </p>
                        </div>

                        <div className="p-6">
                            {transaction && (
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <div className="px-6 py-4">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Receipt className="h-5 w-5 text-blue-600" />
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                Chi tiết giao dịch
                                            </h2>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600">
                                                    Mã giao dịch
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {
                                                        transaction.transaction_ref
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600">
                                                    Phương thức thanh toán
                                                </span>
                                                <div className="flex items-center">
                                                    <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-gray-800">
                                                        VNPay{' '}
                                                        {transaction.bank_code &&
                                                            `(${transaction.bank_code})`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600">
                                                    Số tiền
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {parseInt(
                                                        transaction.amount,
                                                    ).toLocaleString()}{' '}
                                                    {transaction.currency ||
                                                        'VND'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600">
                                                    Ngày thanh toán
                                                </span>
                                                <div className="flex items-center">
                                                    <Clock className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-gray-800">
                                                        {new Date(
                                                            transaction.created_at,
                                                        ).toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pb-3">
                                                <span className="text-gray-600">
                                                    Trạng thái
                                                </span>
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Thành công
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {transaction &&
                                transaction.type === 'wallet_topup' && (
                                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                                        <p className="text-lg text-gray-700">
                                            Số tiền{' '}
                                            <span className="font-bold text-blue-600">
                                                {parseInt(
                                                    transaction.amount,
                                                ).toLocaleString()}{' '}
                                                {transaction.currency || 'VND'}
                                            </span>{' '}
                                            đã được thêm vào ví của bạn.
                                        </p>
                                    </div>
                                )}

                            {transaction &&
                                transaction.type === 'chapter_purchase' && (
                                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                                        <p className="text-lg text-gray-700">
                                            Bạn đã mua thành công chapter "
                                            <span className="font-medium">
                                                {transaction.chapter_title}
                                            </span>
                                            "
                                        </p>
                                    </div>
                                )}

                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                {transaction &&
                                    transaction.type === 'wallet_topup' && (
                                        <Link
                                            href={route('wallet.index')}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-pink-600"
                                        >
                                            <HandCoins className="h-5 w-5" />
                                            Xem ví của tôi
                                        </Link>
                                    )}

                                {transaction &&
                                    transaction.type === 'chapter_purchase' &&
                                    transaction.chapter_id && (
                                        <Link
                                            href={route('chapter.show', {
                                                slug: transaction.comic_slug,
                                                chapter_id:
                                                    transaction.chapter_id,
                                            })}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-pink-600"
                                        >
                                            <Eye className="h-5 w-5" />
                                            Đọc chapter
                                        </Link>
                                    )}

                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Link
                            href={route('wallet.index')}
                            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
                        >
                            <HandCoins className="mb-3 h-10 w-10 text-blue-600" />
                            <h3 className="text-lg font-medium text-gray-800">
                                Quản lý ví
                            </h3>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Kiểm tra số dư và lịch sử giao dịch
                            </p>
                        </Link>

                        <Link
                            href={route('wallet.add-funds')}
                            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
                        >
                            <CreditCard className="mb-3 h-10 w-10 text-blue-600" />
                            <h3 className="text-lg font-medium text-gray-800">
                                Nạp thêm
                            </h3>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Nạp thêm tiền vào ví của bạn
                            </p>
                        </Link>

                        <Link
                            href={route('home')}
                            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
                        >
                            <Receipt className="mb-3 h-10 w-10 text-blue-600" />
                            <h3 className="text-lg font-medium text-gray-800">
                                Khám phá
                            </h3>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Tìm truyện mới để đọc và mua
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PaymentSuccessPage;
