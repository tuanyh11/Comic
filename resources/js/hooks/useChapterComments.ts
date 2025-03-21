// hooks/useChapterComments.ts
import type { Chapter, User } from '@/types/custom';
import { useCommentMutations } from './comment/useCommentMutations';
import { useCommentsQuery } from './comment/useCommentsQuery';
import { useCommentsState } from './comment/useCommentsState';
import { usePusherListeners } from './comment/usePusherListeners';
import { useRepliesManagement } from './comment/useRepliesManagement';

const useChapterComments = (chapter: Chapter, currentUser: User) => {
    // State management
    const {
        showComments,
        newComment,
        setNewComment,
        commentListRef,
        currentPage,
        setCurrentPage,
        replyPaginations,
        setReplyPaginations,
        toggleComments,
        shouldShowReplies,
        setAlwaysShowReplies,
    } = useCommentsState();

    // Main comments query
    const commentsQueryKey = ['comments', chapter.id, currentPage];
    const { data: commentPagination, isLoading: isLoadingComments } =
        useCommentsQuery(chapter, currentPage, showComments);

    // Extract comments from pagination data
    const comments = commentPagination?.data || [];

    // Replies management
    const { fetchReplies, fetchParentOnly, loadMoreReplies } =
        useRepliesManagement(
            commentsQueryKey,
            replyPaginations,
            setReplyPaginations,
        );

    // Comment mutations
    const {
        addComment: addCommentFn,
        addReply: addReplyFn,
        isSubmitting,
    } = useCommentMutations(
        chapter,
        setNewComment,
        commentsQueryKey,
        replyPaginations,
        setReplyPaginations,
    );

    // Setup Pusher listeners for real-time updates
    usePusherListeners(
        chapter,
        currentUser,
        commentsQueryKey,
        commentListRef,
        fetchParentOnly,
    );

    // Add a comment wrapper
    const addComment = () => {
        if (newComment.trim()) {
            addCommentFn(newComment);
        }
    };

    // Add a reply wrapper
    const addReply = (commentId: number, replyText: string) => {
        if (replyText.trim()) {
            addReplyFn(commentId, replyText);
        }
    };

    // Load more comments (pagination)
    const loadMoreComments = () => {
        if (commentPagination && currentPage < commentPagination.last_page) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return {
        showComments,
        comments,
        newComment,
        setNewComment,
        isSubmitting,
        commentListRef,
        toggleComments,
        addComment,
        addReply,
        loadMoreComments,
        loadMoreReplies,
        commentPagination,
        replyPaginations,
        shouldShowReplies,
        setAlwaysShowReplies,
        isLoadingComments,
    };
};

export default useChapterComments;
