// ComicCover.tsx
import { Comic } from '@/types/custom';
import { Link } from '@inertiajs/react';
import { HeartIcon } from 'lucide-react';
import { FC } from 'react';

interface ComicCoverProps {
    comic: Comic;
    isBookmarked: boolean;
    toggleBookmark: () => void;
    voteCount: number;
}

const ComicCover: FC<ComicCoverProps> = ({
    comic,
    isBookmarked,
    toggleBookmark,
    voteCount,
}) => {
    const defaultChapter = comic.chapters.filter((chapter) => chapter?.media);

    return (
        <div className="p-6 md:w-1/3">
            <div className="book-container py-5">
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
                                {comic.status.name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
                {defaultChapter?.[0] ? (
                    <Link
                        href={`/comic/${comic.slug}/chapter/${defaultChapter[0].id}`}
                        className="block w-full transform rounded-full bg-gradient-to-r from-blue-500 to-pink-500 py-3 text-center font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        Bắt đầu đọc
                    </Link>
                ) : (
                    <button className="pointer-events-none block w-full transform rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-2 py-3 text-center font-bold text-white opacity-30 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        Truyện đang cập nhật
                    </button>
                )}
                <div className="flex justify-between gap-3">
                    {/* <button
                        className={`flex w-1/2 items-center justify-center rounded-full border py-2 shadow-sm transition-all duration-300 ${'border-pink-400 bg-pink-50 text-pink-500'}`}
                    >
                        <HeartIcon
                            className={`mr-2 h-5 w-5 fill-pink-500 text-pink-500`}
                        />{' '}
                        {voteCount}
                    </button> */}
                    <button
                        onClick={toggleBookmark}
                        className={`flex w-full items-center justify-center rounded-full border py-2 shadow-sm transition-all duration-300 ${
                            isBookmarked
                                ? 'border-blue-400 bg-blue-50 text-blue-500'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500'
                        }`}
                    >
                        <span className="mr-2">
                            {isBookmarked ? '🔖' : '🔖'}
                        </span>{' '}
                        Theo dõi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComicCover;
