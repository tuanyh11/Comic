import { BookOpen, FileStack, HeartIcon, MessagesSquare } from 'lucide-react';
import { FC } from 'react';

interface ComicStatsProps {
    readCount: number;
    chaptersCount: number;
    commentCount: number;
    voteCount: number;
}

const ComicStats: FC<ComicStatsProps> = ({
    readCount,
    chaptersCount,
    commentCount,
    voteCount,
}) => {
    return (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center rounded-xl bg-indigo-50 p-3 shadow-sm transition-transform hover:scale-105">
                <BookOpen className="h-6 w-6 text-indigo-500" />
                <span className="mt-1 text-sm font-medium text-gray-700">
                    Lượt đọc
                </span>
                <span className="text-lg font-bold text-indigo-600">
                    {readCount.toLocaleString()}
                </span>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-pink-50 p-3 shadow-sm transition-transform hover:scale-105">
                <HeartIcon className="h-6 w-6 text-pink-500" />
                <span className="mt-1 text-sm font-medium text-gray-700">
                    Yêu thích
                </span>
                <span className="text-lg font-bold text-pink-600">
                    {voteCount.toLocaleString()}
                </span>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-violet-50 p-3 shadow-sm transition-transform hover:scale-105">
                <FileStack className="h-6 w-6 text-violet-500" />
                <span className="mt-1 text-sm font-medium text-gray-700">
                    Chương
                </span>
                <span className="text-lg font-bold text-violet-600">
                    {chaptersCount}
                </span>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-fuchsia-50 p-3 shadow-sm transition-transform hover:scale-105">
                <MessagesSquare className="h-6 w-6 text-fuchsia-500" />
                <span className="mt-1 text-sm font-medium text-gray-700">
                    Bình luận
                </span>
                <span className="text-lg font-bold text-fuchsia-600">
                    {commentCount.toLocaleString()}
                </span>
            </div>
        </div>
    );
};

export default ComicStats;
