import { Link } from '@inertiajs/react';
import {
    Bookmark,
    ChevronDown,
    Heart,
    Home,
    Menu,
    MessageCircle,
    X,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface FloatingButtonsProps {
    onToggleComments: () => void;
    onVote: () => void;
    isVoted: boolean;
    nextChapterUrl?: string;
    prevChapterUrl?: string;
    chapterId: number;
    comicSlug: string;
    showBreadcrumb?: boolean;
    onToggleBreadcrumb?: () => void;
}

const EnhancedFloatingButtons: FC<FloatingButtonsProps> = ({
    onToggleComments,
    onVote,
    isVoted = false,
    nextChapterUrl,
    prevChapterUrl,
    chapterId,
    showBreadcrumb = true,
    onToggleBreadcrumb,
}) => {
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [bookmarkPage, setBookmarkPage] = useState<{
        id: number;
        page: number;
    }>();

    useEffect(() => {
        const bookmarks = JSON.parse(
            localStorage.getItem('bookmarkedChapters') || '[]',
        ) as Array<{ id: number; page: number }>;
        setBookmarkPage(bookmarks.find(({ id }) => id === chapterId));
    }, [chapterId]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(
            localStorage.getItem('bookmarkedChapters') || '[]',
        ) as Array<{ id: number; page: number | string }>;
        const iframe = document.getElementById(
            'chapter-ctx',
        ) as HTMLIFrameElement | null;
        const currentPage = iframe?.contentDocument?.getElementById(
            'currentPage',
        ) as HTMLInputElement;

        // Kiểm tra xem chapter đã có trong bookmark chưa
        const existingBookmarkIndex = bookmarks.findIndex(
            (item) => item.id === chapterId,
        );

        if (existingBookmarkIndex !== -1) {
            bookmarks[existingBookmarkIndex].page = currentPage?.value || 1;
        } else {
            bookmarks.push({
                id: chapterId,
                page: currentPage?.value || 1,
            });
        }

        localStorage.setItem('bookmarkedChapters', JSON.stringify(bookmarks));
        const bookmark = bookmarks.find(({ id }) => id === chapterId);
        if (bookmark) {
            setBookmarkPage(bookmark);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
            {/* Main Menu Button */}
            <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                title={showMoreOptions ? 'Đóng menu' : 'Mở menu'}
            >
                {showMoreOptions ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* All Options */}
            {showMoreOptions && (
                <div className="animate-fade-in absolute bottom-16 right-0 flex flex-col gap-3">
                    {prevChapterUrl && (
                        <Link
                            href={prevChapterUrl}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-blue-50"
                            title="Chapter trước"
                        >
                            <ChevronDown className="h-5 w-5 rotate-90" />
                        </Link>
                    )}

                    {nextChapterUrl && (
                        <Link
                            href={nextChapterUrl}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-blue-50"
                            title="Chapter tiếp theo"
                        >
                            <ChevronDown className="h-5 w-5 -rotate-90" />
                        </Link>
                    )}

                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                        onClick={onToggleComments}
                        title="Bình luận"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </button>

                    <button
                        onClick={onVote}
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                            isVoted
                                ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:from-blue-600 hover:to-pink-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        } transition-all`}
                        title="Thích"
                    >
                        <Heart
                            className={`h-5 w-5 ${isVoted ? 'fill-white' : ''}`}
                        />
                    </button>

                    <button
                        onClick={toggleBookmark}
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-xl ${
                            bookmarkPage && bookmarkPage.page > 1
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white ring-offset-2'
                                : 'bg-white text-gray-700 hover:scale-110 hover:bg-gray-50'
                        } transform transition-all duration-300 hover:shadow-2xl focus:outline-none`}
                        title={bookmarkPage?.page ? 'Đã đánh dấu' : 'Đánh dấu'}
                    >
                        <Bookmark
                            className={`h-6 w-6 ${bookmarkPage?.page ? 'fill-white' : ''} transition-all`}
                        />
                        {bookmarkPage && bookmarkPage.page > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-yellow-500 shadow-md">
                                {bookmarkPage?.page}
                            </span>
                        )}
                    </button>

                    {onToggleBreadcrumb && (
                        <button
                            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                                showBreadcrumb
                                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                            } transition-all`}
                            onClick={onToggleBreadcrumb}
                            title={
                                showBreadcrumb
                                    ? 'Ẩn điều hướng'
                                    : 'Hiện điều hướng'
                            }
                        >
                            <Home
                                className={`h-5 w-5 ${!showBreadcrumb ? 'opacity-60' : ''}`}
                            />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedFloatingButtons;
