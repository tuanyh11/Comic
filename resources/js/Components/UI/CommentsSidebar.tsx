import { Comment, LaravelPagination, User } from '@/types/custom';
import { ReplyPaginationsMap } from '@/types/custom-extensions';
import { MessageCircle, RefreshCw, X } from 'lucide-react';
import { FC, useMemo } from 'react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentsSidebarProps {
    comments: Comment[];
    currentUser: User;
    showComments: boolean;
    sidebarWidth: number;
    toggleComments: () => void;
    newComment: string;
    setNewComment: (value: string) => void;
    addComment: () => void;
    addReply: (commentId: number, content: string) => void;
    isSubmitting: boolean;
    commentListRef: React.RefObject<HTMLDivElement>;
    loadMoreComments: () => void;
    loadMoreReplies: (commentId: number, page: number) => void;
    commentPagination?: LaravelPagination<Comment>;
    replyPaginations: ReplyPaginationsMap;
}

export const CommentsSidebar: FC<CommentsSidebarProps> = ({
    comments,
    currentUser,
    showComments,
    sidebarWidth,
    toggleComments,
    newComment,
    setNewComment,
    addComment,
    addReply,
    isSubmitting,
    commentListRef,
    loadMoreComments,
    loadMoreReplies,
    commentPagination,
    replyPaginations,
}) => {
    // Group comments and their replies
    const groupedComments = useMemo(() => {
        const parentComments = comments.filter(
            (comment) => comment.parent_id === null,
        );

        return parentComments.map((parentComment) => {
            const replies = comments?.filter(
                (comment) => comment.parent_id === parentComment.id,
            );
            return {
                comment: parentComment,
                replies: replies,
            };
        });
    }, [comments]);

    return (
        <div
            className={`fixed right-0 top-0 z-10 h-full overflow-hidden bg-gradient-to-br from-blue-600/90 to-pink-500/90 backdrop-blur-md transition-transform ${
                showComments ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
                width: `${sidebarWidth}px`,
            }}
        >
            <div className="flex items-center justify-between border-b border-white/20 p-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-white">
                    <MessageCircle className="h-5 w-5" />
                    Bình luận (
                    {commentPagination?.total || groupedComments.length})
                </h3>
                <button
                    onClick={toggleComments}
                    className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Add comment form */}
            <div className="border-b border-white/20 p-4">
                <CommentForm
                    user={currentUser}
                    value={newComment}
                    onChange={setNewComment}
                    onSubmit={addComment}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Comments list */}
            <div
                ref={commentListRef}
                className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent h-[76vh] overflow-y-auto pb-16"
            >
                <div className="divide-y divide-white/10">
                    {groupedComments.length > 0 ? (
                        <>
                            {groupedComments.map(({ comment, replies }) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    replies={replies}
                                    currentUser={currentUser}
                                    onReply={(commentId, content) =>
                                        addReply(commentId, content)
                                    }
                                    isSubmitting={isSubmitting}
                                    loadMoreReplies={loadMoreReplies}
                                    replyPagination={
                                        replyPaginations[comment.id]
                                    }
                                />
                            ))}

                            {/* Load more comments button */}
                            {commentPagination &&
                                commentPagination.current_page <
                                    commentPagination.last_page && (
                                    <div className="flex justify-center p-4">
                                        <button
                                            onClick={loadMoreComments}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 px-5 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/30"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Xem thêm bình luận
                                        </button>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div className="flex h-32 items-center justify-center">
                            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm">
                                <p className="text-white">
                                    Chưa có bình luận nào.
                                </p>
                                <p className="mt-2 text-sm text-white/80">
                                    Hãy là người đầu tiên bình luận!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
