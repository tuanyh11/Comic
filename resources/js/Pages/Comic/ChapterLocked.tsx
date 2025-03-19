import DefaultLayout from '@/Layouts/DefaultLayout';
import { Chapter } from '@/types/custom';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { FC, useState } from 'react';

interface ChapterLockedProps {
    chapter: Chapter;
    walletBalance: number;
}

const ChapterLocked: FC<ChapterLockedProps> = ({ chapter, walletBalance }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Tính toán xem có đủ tiền mua không
    const hasEnoughBalance = walletBalance >= chapter.pricing;

    const handlePurchase = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `/chapters/${chapter.id}/purchase-with-wallet`,
            );

            if (response.data.success) {
                // Nếu mua thành công, chuyển hướng đến chapter
                router.visit(
                    `/comic/${chapter.comic_id}/chapter/${chapter.id}`,
                );
            } else {
                setError(
                    response.data.message || 'Có lỗi xảy ra khi mua chapter',
                );
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Có lỗi xảy ra khi mua chapter',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>

                        <h1 className="mb-2 text-2xl font-bold">
                            Chapter Bị Khóa
                        </h1>
                        <p className="mb-6 text-gray-600">
                            Đây là nội dung trả phí. Bạn cần mua chapter này để
                            đọc.
                        </p>

                        <div className="mb-6 w-full border-b border-t border-gray-200 py-4">
                            <h2 className="mb-2 text-lg font-bold">
                                {chapter.title}
                            </h2>
                            <p className="mb-4 text-sm text-gray-500">
                                Giá:{' '}
                                <span className="font-bold text-orange-500">
                                    {chapter.pricing.toLocaleString()} VND
                                </span>
                            </p>

                            <div className="mb-4 rounded-lg bg-gray-100 p-3">
                                <h3 className="font-medium text-gray-700">
                                    Số dư ví của bạn
                                </h3>
                                <p
                                    className={`text-xl font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-500'}`}
                                >
                                    {walletBalance.toLocaleString()} VND
                                </p>
                                {!hasEnoughBalance && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Bạn cần thêm{' '}
                                        {(
                                            chapter.pricing - walletBalance
                                        ).toLocaleString()}{' '}
                                        VND để mua chapter này
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 w-full rounded-lg bg-red-100 p-3 text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex w-full flex-col space-y-3">
                            {hasEnoughBalance ? (
                                <button
                                    onClick={handlePurchase}
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                                >
                                    {isLoading
                                        ? 'Đang xử lý...'
                                        : 'Mua bằng số dư ví'}
                                </button>
                            ) : (
                                <Link
                                    href="/wallet/add-funds"
                                    className="w-full rounded-lg bg-orange-500 px-4 py-3 text-center font-bold text-white hover:bg-orange-600"
                                >
                                    Nạp tiền vào ví
                                </Link>
                            )}

                            <Link
                                href={`/payment/vnpay/create-chapter-payment/${chapter.id}`}
                                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-center font-bold text-white hover:bg-blue-600"
                            >
                                Thanh toán qua VNPay
                            </Link>

                            <Link
                                href={`/comic/${chapter.comic_id}`}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-700"
                            >
                                Quay lại danh sách chapter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ChapterLocked;
