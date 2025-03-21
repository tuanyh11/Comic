import FloatingButtons from '@/Components/UI/FloatingButtons';
import useChapterComments from '@/hooks/useChapterComments';
import useResizable from '@/hooks/useResizable';
import { CommentsSidebar } from '@/Pages/Comic/Partials/CommentsSidebar';
import { PageProps } from '@/types';
import { Chapter } from '@/types/custom';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';

const ChapterDetail: FC = () => {
    // Use Inertia's usePage to get props
    const { chapter, auth } = usePage<PageProps<{ chapter: Chapter }>>().props;

    const [hasVoted, setHasVoted] = useState(chapter.has_voted);

    // Use authenticated user from Inertia props
    const currentUser = auth.user;

    // Custom hooks
    const {
        sidebarWidth,
        isDragging,
        containerRef,
        resizerRef,
        handleMouseDown,
    } = useResizable(350);

    // Sử dụng hook chính useChapterComments đã được tái cấu trúc
    const {
        // State
        showComments,
        newComment,
        commentListRef,

        // Data
        comments,
        commentPagination,
        replyPaginations,
        isSubmitting,

        // Actions
        toggleComments,
        setNewComment,
        addComment,
        addReply,
        loadMoreComments,
        loadMoreReplies,
    } = useChapterComments(chapter, currentUser);

    const onVote = async () => {
        await axios.post(route('chapters.vote', { chapter_id: chapter.id }));
        setHasVoted((pre) => {
            !pre && toast.success('vote thành công');
            return !pre;
        });
    };

    // Phương thức Submit comment được điều chỉnh để tương thích với API mới
    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment(newComment);
        }
    };

    return (
        <div ref={containerRef} className="relative flex h-[100dvh] w-full">
            <div
                className={`transition-all ${showComments ? 'w-full' : 'w-full'}`}
            >
                {!showComments && (
                    <FloatingButtons
                        onVote={onVote}
                        isVoted={hasVoted}
                        onToggleComments={toggleComments}
                    />
                )}

                <iframe
                    className="h-full w-full"
                    src={`${window.location.href}/iframe`}
                ></iframe>
            </div>

            {/* Resizer handle */}
            {showComments && (
                <div
                    ref={resizerRef}
                    className={`absolute right-auto top-0 z-20 h-full w-1 bg-black/10 backdrop-blur-sm hover:bg-blue-500 ${
                        isDragging ? 'bg-blue-500' : ''
                    }`}
                    onMouseDown={handleMouseDown}
                />
            )}

            {/* Comments Sidebar - điều chỉnh để sử dụng các props từ hook mới */}
            <CommentsSidebar
                comments={comments}
                currentUser={currentUser}
                showComments={showComments}
                sidebarWidth={sidebarWidth}
                toggleComments={toggleComments}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={handleAddComment}
                addReply={addReply}
                isSubmitting={isSubmitting}
                commentListRef={commentListRef}
                loadMoreComments={loadMoreComments}
                loadMoreReplies={loadMoreReplies}
                commentPagination={commentPagination}
                replyPaginations={replyPaginations}
            />
        </div>
    );
};

export default ChapterDetail;
