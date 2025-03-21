// hooks/comments/useCommentsQuery.ts
import { Chapter, LaravelPagination } from '@/types/custom';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

export const useCommentsQuery = (
    chapter: Chapter,
    currentPage: number,
    showComments: boolean,
): UseQueryResult<LaravelPagination<Comment>> => {
    const commentsQueryKey = ['comments', chapter.id, currentPage];

    return useQuery({
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
        enabled: showComments, // Only fetch when comments are shown
    });
};
