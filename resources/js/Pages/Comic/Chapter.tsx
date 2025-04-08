import Breadcrumb from '@/Components/UI/Breadcrumb';
import EnhancedFloatingButtons from '@/Components/UI/EnhancedFloatingButtons';
import useChapterComments from '@/hooks/useChapterComments';
import useResizable from '@/hooks/useResizable';
import { PageProps } from '@/types';
import { Chapter } from '@/types/custom';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { CommentsSidebar } from './Partials/CommentsSidebar';

const ChapterDetail: FC = () => {
    // Get page props from Inertia
    const { chapter, auth, nextChapter, prevChapter } = usePage<
        PageProps<{
            chapter: Chapter;
            nextChapter: Chapter;
            prevChapter: Chapter;
        }>
    >().props;

    // Local state
    const [hasVoted, setHasVoted] = useState(chapter.has_voted);
    const [showBreadcrumb, setShowBreadcrumb] = useState(true);

    // Current user from auth props
    const currentUser = auth.user;

    // Custom hooks
    const {
        sidebarWidth,
        isDragging,
        containerRef,
        resizerRef,
        handleMouseDown,
    } = useResizable(350);

    const {
        showComments,
        newComment,
        setNewComment,
        isSubmitting,
        commentListRef,
        toggleComments,
        comments,
        addComment,
        addReply,
        loadMoreComments,
        loadMoreReplies,
        commentPagination,
        replyPaginations,
    } = useChapterComments(chapter, currentUser);

    // Helper function to get the current page slug from URL
    const getCurrentPageSlug = () => {
        const pathname = window.location.pathname;
        const regex = /comic\/([^/]+)\/chapter/;
        const match = pathname.match(regex);

        if (match && match[1]) {
            return match[1];
        }

        // Alternative using split
        const pathSegments = pathname.split('/').filter((segment) => segment);
        if (pathSegments.length >= 2 && pathSegments[0] === 'comic') {
            return pathSegments[1];
        }

        return null;
    };

    // Handle voting for the chapter
    const onVote = async () => {
        try {
            await axios.post(
                route('chapter.vote', {
                    chapter_id: chapter.id,
                    slug: getCurrentPageSlug(),
                }),
            );

            setHasVoted((prev) => {
                const newState = !prev;
                if (newState) {
                    toast.success('Vote thành công');
                }
                return newState;
            });
        } catch (error) {
            toast.error('Không thể vote. Vui lòng thử lại sau.');
        }
    };

    // Toggle breadcrumb visibility
    const toggleBreadcrumb = () => {
        setShowBreadcrumb((prev) => !prev);
    };

    // Create breadcrumb items
    const breadcrumbItems = [
        {
            label: 'Truyện',
            href: `/comic/`,
        },
        {
            label: chapter.comic?.title || 'Truyện',
            href: `/comic/${chapter.comic?.id}`,
        },
        {
            label: `Chương ${chapter.order}`,
        },
    ];

    // Calculate URLs for next and previous chapters
    const nextChapterUrl =
        nextChapter &&
        `${window.location.pathname.split('/').slice(0, -1).join('/')}/${nextChapter.id}`;

    const prevChapterUrl =
        prevChapter &&
        `${window.location.pathname.split('/').slice(0, -1).join('/')}/${prevChapter?.id}`;

    return (
        <div ref={containerRef} className="relative flex h-[100dvh] w-full">
            {/* Main content area */}
            <div
                style={{
                    backgroundImage: `url(/storage/client/detail.jpg)`,
                }}
                className={`transition-all ${showComments ? 'w-full' : 'w-full'} relative bg-cover after:absolute after:inset-0 after:bg-black/50 after:from-black/50 after:to-black/90`}
            >
                {/* Breadcrumb Navigation */}
                {showBreadcrumb && (
                    <div className="absolute left-4 top-4 z-40">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                )}

                {/* Floating action buttons - only show when comments are hidden */}
                {!showComments && (
                    <EnhancedFloatingButtons
                        onVote={onVote}
                        isVoted={hasVoted}
                        onToggleComments={toggleComments}
                        onToggleBreadcrumb={toggleBreadcrumb}
                        showBreadcrumb={showBreadcrumb}
                        chapterId={chapter.id}
                        comicSlug={chapter.comic?.slug || ''}
                        nextChapterUrl={nextChapterUrl}
                        prevChapterUrl={prevChapterUrl}
                    />
                )}

                {/* Chapter content iframe */}
                <iframe
                    id="chapter-ctx"
                    className="relative z-10 h-full w-full"
                    src={`${window.location.href}/iframe`}
                    title={`Chapter ${chapter.order} content`}
                ></iframe>
            </div>

            {/* Resizer handle - only show when comments are visible */}
            {showComments && (
                <div
                    ref={resizerRef}
                    className={`absolute right-auto top-0 z-20 h-full w-1 cursor-col-resize ${
                        isDragging
                            ? 'bg-blue-500'
                            : 'bg-black/10 hover:bg-blue-500'
                    } backdrop-blur-sm`}
                    onMouseDown={handleMouseDown}
                    aria-hidden="true"
                />
            )}

            {/* Comments Sidebar */}
            <CommentsSidebar
                comments={comments}
                currentUser={currentUser}
                showComments={showComments}
                sidebarWidth={sidebarWidth}
                toggleComments={toggleComments}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
                addReply={addReply}
                isSubmitting={isSubmitting}
                commentListRef={commentListRef}
                loadMoreComments={loadMoreComments}
                loadMoreReplies={loadMoreReplies}
                commentPagination={commentPagination || undefined}
                replyPaginations={replyPaginations}
            />
        </div>
    );
};

export default ChapterDetail;
