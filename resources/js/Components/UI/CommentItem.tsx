import { Comment, LaravelPagination, User } from '@/types/custom';
import { formatDate } from '@/utils/formatDate';
import { Heart, MessageCircle, MoreVertical, Reply } from 'lucide-react';
import { FC, useState } from 'react';
import Avatar from './Avatar';
import { CommentForm } from './CommentForm';
import { CommentReply } from './CommentReply';

interface CommentItemProps {
    comment: Comment;
    replies: Comment[];
    currentUser: User;
    onReply: (commentId: number, content: string) => void;
    isSubmitting: boolean;
    loadMoreReplies: (commentId: number, page: number) => void;
    replyPagination?: LaravelPagination<Comment>;
}

export const CommentItem: FC<CommentItemProps> = ({
    comment,
    replies,
    currentUser,
    onReply,
    isSubmitting,
    loadMoreReplies,
    replyPagination,
}) => {
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [currentReplyPage, setCurrentReplyPage] = useState<number>(1);
    const [isLiked, setIsLiked] = useState(false);

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setReplyingTo(null);
        }
    };

    const handleLoadMoreReplies = () => {
        const nextPage = currentReplyPage + 1;
        loadMoreReplies(comment.id, nextPage);
        setCurrentReplyPage(nextPage);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    // Số lượng replies đã được tải
    const loadedRepliesCount = replies.length;

    // Tổng số replies (từ replies_count hoặc từ pagination)
    const totalRepliesCount =
        comment.replies_count || replyPagination?.total || 0;

    // Còn replies chưa được tải không?
    const hasMoreReplies = loadedRepliesCount < totalRepliesCount;

    // Số lượng replies còn lại cần tải
    const remainingReplies = totalRepliesCount - loadedRepliesCount;

    return (
        <div className="p-4">
            <div className="flex items-start space-x-3">
                <Avatar user={comment.user} size="md" />
                <div className="flex-grow">
                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                                {comment.user.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                    {formatDate(comment.created_at)}
                                </span>
                                <button className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600">
                                    <MoreVertical size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                            {comment.content}
                        </p>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 pl-1">
                        {/* <button
                            className={`flex items-center space-x-1 text-xs ${isLiked ? 'text-pink-500' : 'text-white hover:text-pink-500'} transition-colors`}
                            onClick={handleLike}
                        >
                            <Heart
                                size={14}
                                className={isLiked ? 'fill-pink-500' : ''}
                            />
                            <span>Thích</span>
                        </button> */}
                        <button
                            className="flex items-center space-x-1 text-xs text-white transition-colors hover:text-blue-600"
                            onClick={() => setReplyingTo(comment.id)}
                        >
                            <Reply size={14} />
                            <span>Trả lời</span>
                        </button>
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                        <div className="mt-3 pl-2">
                            <CommentForm
                                user={currentUser}
                                value={replyText}
                                onChange={setReplyText}
                                onSubmit={handleReply}
                                isSubmitting={isSubmitting}
                                placeholder="Viết phản hồi..."
                                rows={2}
                                onCancel={() => setReplyingTo(null)}
                            />
                        </div>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-6">
                            {replies.map((reply) => (
                                <CommentReply key={reply.id} reply={reply} />
                            ))}

                            {/* Load more replies button - hiển thị khi còn replies chưa tải */}
                            {hasMoreReplies && (
                                <button
                                    onClick={handleLoadMoreReplies}
                                    className="mt-2 text-xs text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                >
                                    Xem thêm {remainingReplies} phản hồi...
                                </button>
                            )}
                        </div>
                    )}

                    {/* Show view replies button if there are replies but none loaded yet */}
                    {replies.length === 0 && totalRepliesCount > 0 && (
                        <button
                            onClick={() => loadMoreReplies(comment.id, 1)}
                            className="mt-2 flex items-center gap-1 pl-6 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            <MessageCircle size={12} />
                            Xem {totalRepliesCount} phản hồi...
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
