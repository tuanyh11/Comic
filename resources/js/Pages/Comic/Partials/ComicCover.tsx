import { Comic } from '@/types/custom';
import { Link } from '@inertiajs/react';
import {
    BookmarkIcon,
    BookOpen,
    FileStack,
    HeartIcon,
    MessagesSquare,
} from 'lucide-react';
import { FC } from 'react';

interface ComicCoverProps {
    comic: Comic;
    isBookmarked: boolean;
    toggleBookmark: () => void;
    voteCount: number;
    readCount?: number;
    chaptersCount?: number;
    commentCount?: number;
}

const ComicCover: FC<ComicCoverProps> = ({
    comic,
    isBookmarked,
    toggleBookmark,
    voteCount,
    readCount = 0,
    chaptersCount = 0,
    commentCount = 0,
}) => {
    const defaultChapter = comic.chapters.filter((chapter) => chapter?.media);

    return (
        <div className="relative p-8 md:w-1/3">
            <div className="book-container py-4">
                <div className="book relative">
                    <div className="absolute inset-0">
                        <img
                            src={comic.media[0].media.url}
                            alt="Story Cover"
                            className="h-full w-full object-cover"
                        />
                        {comic.status && (
                            <div
                                style={{
                                    backgroundColor: `${comic.status.color}`,
                                }}
                                className="absolute right-0 top-4 z-[999999] rounded-l-full px-3 py-1 text-sm font-medium text-white shadow-md"
                            >
                                {comic.chapters.length > 0
                                    ? comic.status.name
                                    : 'Truyện đang cập nhật'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center rounded-xl bg-indigo-50 p-3 shadow-sm transition-transform hover:scale-105">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    <span className="mt-1 text-xs font-medium text-gray-700">
                        Lượt đọc
                    </span>
                    <span className="text-base font-bold text-indigo-600">
                        {readCount.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-pink-50 p-3 shadow-sm transition-transform hover:scale-105">
                    <HeartIcon className="h-5 w-5 text-pink-500" />
                    <span className="mt-1 text-xs font-medium text-gray-700">
                        Yêu thích
                    </span>
                    <span className="text-base font-bold text-pink-600">
                        {voteCount.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-violet-50 p-3 shadow-sm transition-transform hover:scale-105">
                    <FileStack className="h-5 w-5 text-violet-500" />
                    <span className="mt-1 text-xs font-medium text-gray-700">
                        Chương
                    </span>
                    <span className="text-base font-bold text-violet-600">
                        {chaptersCount}
                    </span>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-fuchsia-50 p-3 shadow-sm transition-transform hover:scale-105">
                    <MessagesSquare className="h-5 w-5 text-fuchsia-500" />
                    <span className="mt-1 text-xs font-medium text-gray-700">
                        Bình luận
                    </span>
                    <span className="text-base font-bold text-fuchsia-600">
                        {commentCount.toLocaleString()}
                    </span>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
                {defaultChapter?.[0] ? (
                    <Link
                        href={`/comic/${comic.slug}/chapter/${defaultChapter[0].id}`}
                        className="block w-full transform rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3.5 text-center font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        Bắt đầu đọc
                    </Link>
                ) : (
                    <button className="pointer-events-none block w-full transform rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-2 py-3.5 text-center font-bold text-white opacity-50 shadow-lg">
                        Truyện đang cập nhật
                    </button>
                )}
                <div className="flex justify-between gap-3">
                    <button
                        onClick={toggleBookmark}
                        className={`group flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-medium shadow-md transition-all duration-300 ${
                            isBookmarked
                                ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-600'
                                : 'border-gray-300 hover:border-fuchsia-400 hover:bg-fuchsia-50 hover:text-fuchsia-600'
                        }`}
                    >
                        <BookmarkIcon
                            className={`h-5 w-5 ${isBookmarked ? 'fill-fuchsia-500 text-fuchsia-500' : 'group-hover:text-fuchsia-500'}`}
                        />
                        Theo dõi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComicCover;
