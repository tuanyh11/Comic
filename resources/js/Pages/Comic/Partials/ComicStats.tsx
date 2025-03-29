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
        <div className="mt-6 flex space-x-6 text-sm text-gray-700">
            <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                <span>{readCount.toLocaleString()} Lượt đọc</span>
            </div>
            <div className="flex items-center">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-500" />
                <span>{voteCount.toLocaleString()} Yêu thích</span>
            </div>
            <div className="flex items-center">
                <FileStack className="mr-2 h-5 w-5 text-blue-500" />
                <span>{chaptersCount} Chương</span>
            </div>
            <div className="flex items-center">
                <MessagesSquare className="mr-2 h-5 w-5 text-blue-500" />
                <span>{commentCount.toLocaleString()} Bình luận</span>
            </div>
        </div>
    );
};

export default ComicStats;
