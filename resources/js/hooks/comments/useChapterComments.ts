// hooks/comments/useChapterComments.ts
import { Chapter, Comment, User } from '@/types/custom';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import useCacheUpdates from './useCacheUpdates';
import useCommentMutations from './useCommentMutations';
import useCommentsQuery from './useCommentsQuery';
import useRealTimeUpdates from './useRealTimeUpdates';
import useReplyPagination from './useReplyPagination';

const useChapterComments = (chapter: Chapter, currentUser: User) => {
    // Core state
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const commentListRef = useRef<HTMLDivElement>(null);

    // Use separated hooks
    const {
        commentsQuery,
        commentsQueryKey,
        fetchReplies: fetchRepliesAPI,
        fetchParentComment,
    } = useCommentsQuery(chapter, currentPage, showComments);

    const {
        replyPaginations,
        updateReplyPaginationData,
        updateReplyPagination,
    } = useReplyPagination();

    const {
        updateCacheWithNewReply,
        updateCacheWithParentAndReply,
        updateCacheWithNewComment,
        updateCacheWithReplies,
    } = useCacheUpdates(commentsQueryKey);

    // Handle reply success
    const handleReplySuccess = (reply: Comment) => {
        // Update cache with new reply
        updateCacheWithNewReply(reply);

        // Update reply pagination if it exists
        if (replyPaginations[reply.parent_id]) {
            updateReplyPagination(reply.parent_id, reply);
        }
    };

    const { addComment, addReply, isSubmitting } = useCommentMutations(
        chapter,
        commentsQueryKey,
        () => setNewComment(''), // Comment success callback
        handleReplySuccess, // Reply success callback
    );

    // Function to fetch parent comment and add a single reply
    const fetchParentWithReply = async (parentId: number, reply: Comment) => {
        try {
            const parentComment = await fetchParentComment(parentId);
            updateCacheWithParentAndReply(parentComment, reply);
            updateReplyPagination(parentId, reply);
        } catch (error) {
            console.error('Error fetching parent comment:', error);
        }
    };

    // Function to fetch replies for a comment
    const fetchReplies = async (commentId: number, page = 1) => {
        try {
            const data = await fetchRepliesAPI(commentId, page);
            updateCacheWithReplies(commentId, data.data, page);
            updateReplyPaginationData(commentId, data);
        } catch (error) {
            toast.error('Failed to load replies');
        }
    };

    // Define real-time event handlers
    const handleNewComment = (comment: Comment) => {
        updateCacheWithNewComment(comment);

        // Scroll to top
        if (commentListRef.current) {
            commentListRef.current.scrollTop = 0;
        }
    };

    const handleNewReply = (reply: Comment) => {
        if (!reply.parent_id) return;

        // Check if we need to fetch parent
        const queryData = commentsQuery.data;
        if (!queryData) return;

        const comments = queryData.data;
        const parentExists = comments.some((c) => c.id === reply.parent_id);
        const replyExists = comments.some((c) => c.id === reply.id);

        if (replyExists) return;

        if (parentExists) {
            updateCacheWithNewReply(reply);
        } else {
            fetchParentWithReply(reply.parent_id, reply);
        }
    };

    // Use real-time updates hook
    useRealTimeUpdates({
        chapter,
        currentUser,
        commentListRef,
        handleNewComment,
        handleNewReply,
    });

    return {
        // Data
        comments: commentsQuery.data?.data || [],
        commentPagination: commentsQuery.data,
        isLoading: commentsQuery.isLoading,
        isSubmitting,
        replyPaginations,

        // State
        showComments,
        newComment,
        commentListRef,

        // Actions
        toggleComments: () => setShowComments(!showComments),
        setNewComment,
        addComment,
        addReply,
        fetchReplies,
        loadMoreComments: () => {
            if (
                commentsQuery.data &&
                currentPage < commentsQuery.data.last_page
            ) {
                setCurrentPage((prev) => prev + 1);
            }
        },
        loadMoreReplies: fetchReplies,
    };
};

export default useChapterComments;
