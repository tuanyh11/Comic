// hooks/comments/useCommentsQuery.ts
import { Chapter, Comment, LaravelPagination } from '@/types/custom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCommentsQuery = (
    chapter: Chapter,
    currentPage: number,
    showComments: boolean,
) => {
    // Query key for comments
    const commentsQueryKey = ['comments', chapter.id, currentPage];

    // Main comments query
    const commentsQuery = useQuery({
        queryKey: commentsQueryKey,
        queryFn: async () => {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('chapter.comments', {
                    chapter_id: chapter.id,
                    page: currentPage,
                }),
            );
            return response.data;
        },
        enabled: showComments,
    });

    // Function to fetch replies for a comment
    const fetchReplies = async (commentId: number, page = 1) => {
        try {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', { comment_id: commentId, page }),
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching replies:', error);
            throw error;
        }
    };

    // Function to fetch parent comment by ID
    const fetchParentComment = async (parentId: number) => {
        try {
            const response = await axios.get(
                route('comments.get', { comment_id: parentId }),
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching parent comment:', error);
            throw error;
        }
    };

    return {
        commentsQuery,
        commentsQueryKey,
        fetchReplies,
        fetchParentComment,
    };
};

export default useCommentsQuery;
