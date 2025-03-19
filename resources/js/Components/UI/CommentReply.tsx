import { Comment } from '@/types/custom';
import { formatDate } from '@/utils/formatDate';
import { Heart } from 'lucide-react';
import { FC, useState } from 'react';
import Avatar from './Avatar';

interface CommentReplyProps {
    reply: Comment;
}

export const CommentReply: FC<CommentReplyProps> = ({ reply }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <div className="flex items-start space-x-2">
            <Avatar user={reply.user} size="sm" />
            <div className="flex-grow">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <div className="flex items-center justify-between">
                        <h5 className="text-xs font-medium text-gray-900">
                            {reply.user.name}
                        </h5>
                        <span className="text-xs text-gray-500">
                            {formatDate(reply.created_at)}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-700">
                        {reply.content}
                    </p>
                </div>
                {/* <button
                    className={`mt-1 flex items-center space-x-1 pl-1 text-xs ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'} transition-colors`}
                    onClick={handleLike}
                >
                    <Heart
                        size={12}
                        className={isLiked ? 'fill-pink-500' : ''}
                    />
                    <span>Thích</span>
                </button> */}
            </div>
        </div>
    );
};

export default CommentReply;
