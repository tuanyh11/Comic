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

function getCurrentPageSlug() {
    // Obter o pathname da URL atual
    const pathname = window.location.pathname;

    // Regex para extrair o slug entre "comic/" e "/chapter/"
    const regex = /comic\/([^/]+)\/chapter/;
    const match = pathname.match(regex);

    if (match && match[1]) {
        return match[1];
    }

    // Alternativa usando split (caso a regex não funcione)
    const pathSegments = pathname.split('/').filter((segment) => segment);
    if (pathSegments.length >= 2 && pathSegments[0] === 'comic') {
        return pathSegments[1];
    }

    return null;
}

const ChapterDetail: FC = () => {
    // Use Inertia's usePage to get props
    const { chapter, auth, nextChapter, prevChapter } = usePage<
        PageProps<{
            chapter: Chapter;
            nextChapter: Chapter;
            prevChapter: Chapter;
        }>
    >().props;

    const [hasVoted, setHasVoted] = useState(chapter.has_voted);
    // Added state for breadcrumb visibility
    const [showBreadcrumb, setShowBreadcrumb] = useState(true);
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

    const onVote = async () => {
        await axios.post(
            route('chapter.vote', {
                chapter_id: chapter.id,
                slug: getCurrentPageSlug(),
            }),
        );
        setHasVoted((pre) => {
            !pre && toast.success('vote thành công');
            return !pre;
        });
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

    console.log(prevChapter);

    const nextChapterUrl =
        nextChapter &&
        `${window.location.pathname.split('/').slice(0, -1).join('/')}/${nextChapter.id}`;
    const preChapterUrl =
        prevChapter &&
        `${window.location.pathname.split('/').slice(0, -1).join('/')}/${prevChapter?.id}`;
    return (
        <div ref={containerRef} className="relative flex h-[100dvh] w-full">
            <div
                style={{
                    backgroundImage: `url(/storage/client/detail.jpg)`,
                }}
                className={`transition-all ${showComments ? 'w-full' : 'w-full'} relative bg-cover after:absolute after:inset-0 after:bg-black/50 after:from-black/50 after:to-black/90`}
            >
                {/* Breadcrumb Navigation - Only show if showBreadcrumb is true */}
                {showBreadcrumb && (
                    <div className="absolute left-4 top-4 z-40">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                )}

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
                        prevChapterUrl={preChapterUrl}
                    />
                )}

                {/* Replace PDFViewer with PDFFlipbook */}
                {/* <PDFFlipbook fileUrl={chapter.media.url} /> */}
                <iframe
                    id="chapter-ctx"
                    className="relative z-10 h-full w-full"
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
                    // style={{
                    //     left: `calc(100% - ${sidebarWidth}px - 2px)`,
                    // }}
                    onMouseDown={handleMouseDown}
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
