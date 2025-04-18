import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Bookmark,
    ChevronDown,
    Heart,
    Menu,
    MessageCircle,
    Settings,
    Share2,
    X,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface FloatingButtonsProps {
    onToggleComments: () => void;
    onVote: () => void;
    isVoted: boolean;
    nextChapterUrl?: string;
    prevChapterUrl?: string;
    onToggleFullscreen?: () => void;
    chapterId: number;
    comicSlug: string;
}

const EnhancedFloatingButtons: FC<FloatingButtonsProps> = ({
    onToggleComments,
    onVote,
    isVoted = false,
    nextChapterUrl,
    prevChapterUrl,
    onToggleFullscreen,
    chapterId,
    comicSlug,
}) => {
    const [showMoreOptions, setShowMoreOptions] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        // Check if this chapter is bookmarked in localStorage
        const bookmarks = JSON.parse(
            localStorage.getItem('bookmarkedChapters') || '[]',
        );
        setIsBookmarked(bookmarks.includes(chapterId));
    }, [chapterId]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(
            localStorage.getItem('bookmarkedChapters') || '[]',
        );

        if (isBookmarked) {
            const updatedBookmarks = bookmarks.filter(
                (id: number) => id !== chapterId,
            );
            localStorage.setItem(
                'bookmarkedChapters',
                JSON.stringify(updatedBookmarks),
            );
        } else {
            bookmarks.push(chapterId);
            localStorage.setItem(
                'bookmarkedChapters',
                JSON.stringify(bookmarks),
            );
        }

        setIsBookmarked(!isBookmarked);
    };

    const shareChapter = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: document.title,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link đã được sao chép!');
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
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                        onClick={() => window.history.back()}
                        title="Quay lại"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

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
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                            isBookmarked
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        } transition-all`}
                        title={isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu'}
                    >
                        <Bookmark
                            className={`h-5 w-5 ${isBookmarked ? 'fill-white' : ''}`}
                        />
                    </button>

                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                        onClick={shareChapter}
                        title="Chia sẻ"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>

                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                        onClick={onToggleFullscreen}
                        title="Toàn màn hình"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnhancedFloatingButtons;
