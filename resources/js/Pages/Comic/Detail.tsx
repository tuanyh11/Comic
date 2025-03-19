import RecommendedComics from '@/Components/UI/RecommendedComics';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Comic } from '@/types/custom';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { BookOpen, HeartIcon, MessagesSquare, User } from 'lucide-react';
import { FC, useState } from 'react';

const Detail: FC<{ comic: Comic; walletBalance?: number }> = ({
    comic,
    walletBalance = 0,
}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const toggleFollow = () => setIsFollowing(!isFollowing);
    const toggleBookmark = () => setIsBookmarked(!isBookmarked);

    // Xử lý click vào chapter cần mở khóa
    const handleChapterClick = async (chapter) => {
        // Nếu chapter miễn phí hoặc đã mở khóa, điều hướng trực tiếp đến chapter
        if (!chapter.pricing || chapter.is_unlocked) {
            router.visit(`/comic/${comic.slug}/chapter/${chapter.id}`);
            return;
        }

        // Nếu có đủ tiền trong ví, xác nhận mua chapter
        if (walletBalance >= chapter.pricing) {
            if (
                confirm(
                    `Bạn có muốn mua chapter này với giá ${chapter.pricing} VND không?`,
                )
            ) {
                try {
                    // Gọi API để mua chapter bằng số dư ví
                    const response = await axios.post(
                        `/chapters/${chapter.id}/purchase`,
                    );
                    if (response.data.success) {
                        // Nếu mua thành công, chuyển đến trang chapter
                        router.visit(
                            `/comic/${comic.id}/chapter/${chapter.id}`,
                        );
                    }
                } catch (error) {
                    alert(
                        'Có lỗi xảy ra khi mua chapter. Vui lòng thử lại sau.',
                    );
                    console.error(error);
                }
            }
        } else {
            // Nếu không đủ tiền, chuyển đến trang nạp tiền
            if (
                confirm(
                    'Số dư trong ví không đủ. Bạn có muốn nạp thêm tiền không?',
                )
            ) {
                router.visit('/wallet/add-funds');
            }
        }
    };

    const readCount = comic.chapters.reduce((a, b) => a + b.read_count, 0);
    const voteCount = comic.chapters.reduce((a, b) => a + b.vote_count, 0);
    const commentCount = comic.chapters.reduce(
        (a, b) => a + b.comments_count,
        0,
    );

    // Lấy danh sách tag_ids
    const tagIds = comic.tags.map((tag) => tag.id);
    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 py-12 font-sans">
                {/* Main Content */}
                <main className="mx-auto max-w-6xl p-4">
                    {/* Story Header */}
                    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg md:flex-row">
                        {/* Book Cover */}
                        <div className="p-6 md:w-1/3">
                            <div className="book-container py-5">
                                <div className="book relative">
                                    <img
                                        src={comic.thumbnail.url}
                                        alt="Story Cover"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    {/* Badge overlay */}
                                    {comic.status === 'ongoing' && (
                                        <div className="absolute right-0 top-4 rounded-l-full bg-blue-500 px-3 py-1 text-sm font-medium text-white shadow-md">
                                            Đang cập nhật
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                {comic.chapters[0] ? (
                                    <Link
                                        href={`/comic/${comic.id}/chapter/${comic.chapters[0]?.id}`}
                                        className="block w-full transform rounded-full bg-gradient-to-r from-blue-500 to-pink-500 py-3 text-center font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        Bắt đầu đọc
                                    </Link>
                                ) : (
                                    <button className="pointer-events-none block w-full transform rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-2 py-3 text-center font-bold text-white opacity-30 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        Truyện đang trong quá trình xuất bản
                                    </button>
                                )}
                                <div className="flex justify-between gap-3">
                                    <button
                                        className={`flex w-1/2 items-center justify-center rounded-full border py-2 shadow-sm transition-all duration-300 ${'border-pink-400 bg-pink-50 text-pink-500'}`}
                                    >
                                        <HeartIcon
                                            className={`mr-2 h-5 w-5 fill-pink-500 text-pink-500`}
                                        />{' '}
                                        {voteCount}
                                    </button>
                                    <button
                                        onClick={toggleBookmark}
                                        className={`flex w-1/2 items-center justify-center rounded-full border py-2 shadow-sm transition-all duration-300 ${
                                            isBookmarked
                                                ? 'border-blue-400 bg-blue-50 text-blue-500'
                                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500'
                                        }`}
                                    >
                                        <span className="mr-2">
                                            {isBookmarked ? '🔖' : '🔖'}
                                        </span>{' '}
                                        Lưu lại
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Story Details */}
                        <div className="p-6 md:w-2/3">
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {comic.title}
                                </h1>
                                <div className="flex space-x-2 text-gray-500">
                                    <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                                        ⋮
                                    </button>
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="mr-3 flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-pink-500 uppercase text-white shadow-md">
                                        <span>{comic.author.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {comic.author.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Tác giả
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleFollow}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                                        isFollowing
                                            ? 'bg-gray-200 text-gray-800'
                                            : 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                                </button>
                            </div>

                            {/* Story Stats */}
                            <div className="mt-6 flex space-x-6 text-sm text-gray-700">
                                <div className="flex items-center">
                                    <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                                    <span>
                                        {readCount.toLocaleString()} Lượt đọc
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <User className="mr-2 h-5 w-5 text-blue-500" />
                                    <span>{comic.chapters.length} Chương</span>
                                </div>
                                <div className="flex items-center">
                                    <MessagesSquare className="mr-2 h-5 w-5 text-blue-500" />
                                    <span>
                                        {commentCount.toLocaleString()} Bình
                                        luận
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {comic.tags.map((item) => (
                                    <span
                                        key={item.id}
                                        className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                                    >
                                        #{item.name}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                    Giới thiệu
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: comic.description,
                                    }}
                                    className="rounded-lg bg-blue-50 p-4 text-gray-700"
                                ></div>
                            </div>

                            {/* Wallet Balance (nếu có) */}
                            {walletBalance > 0 && (
                                <div className="mt-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-100 to-pink-100 p-4">
                                    <p className="text-sm font-medium">
                                        Số dư ví:{' '}
                                        <span className="font-bold text-blue-600">
                                            {walletBalance.toLocaleString()} VND
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Table of Contents Preview */}
                            <div className="mt-8">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                    Danh sách chương
                                </h2>
                                <div className="space-y-3 overflow-hidden rounded-lg border border-gray-200">
                                    {comic.chapters.map((chapter) => {
                                        // Kiểm tra xem chapter có phải trả phí không
                                        const isPaid = chapter.pricing > 0;
                                        // Kiểm tra xem chapter đã được mở khóa chưa
                                        const isUnlocked =
                                            chapter.is_unlocked === true;
                                        // Kiểm tra xem chapter đã đọc chưa
                                        const isRead = chapter.is_read === true;

                                        return (
                                            <div
                                                key={chapter.id}
                                                className={`flex cursor-pointer items-center justify-between border-b border-gray-200 p-4 transition-colors hover:bg-blue-50 ${
                                                    isPaid && !isUnlocked
                                                        ? 'bg-gray-50'
                                                        : isRead
                                                          ? 'bg-blue-50'
                                                          : ''
                                                }`}
                                                onClick={() =>
                                                    handleChapterClick(chapter)
                                                }
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-800">
                                                            Chương{' '}
                                                            {chapter.order}:{' '}
                                                            {chapter.title}
                                                        </p>
                                                        {isRead && (
                                                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                Đã đọc
                                                            </span>
                                                        )}
                                                        {isPaid &&
                                                            !isUnlocked && (
                                                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                                    {
                                                                        chapter.pricing
                                                                    }
                                                                    đ
                                                                </span>
                                                            )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        Cập nhật:{' '}
                                                        {new Date(
                                                            chapter.updated_at,
                                                        ).toLocaleDateString(
                                                            'vi-VN',
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-blue-500" />
                                                        {chapter.read_count.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <MessagesSquare className="h-4 w-4 text-blue-500" />
                                                        {chapter.comments_count.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {comic.chapters.length > 4 && (
                                        <button className="w-full py-3 text-center font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800">
                                            Xem tất cả {comic.chapters.length}{' '}
                                            chương
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Stories */}
                    <div className="mb-12 mt-10">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800">
                            <span className="mr-2 inline-block h-1 w-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500"></span>
                            Có thể bạn cũng thích
                        </h2>
                        <RecommendedComics
                            currentComicId={comic.id}
                            tagIds={tagIds}
                        />
                    </div>
                </main>
            </div>
        </DefaultLayout>
    );
};

export default Detail;
