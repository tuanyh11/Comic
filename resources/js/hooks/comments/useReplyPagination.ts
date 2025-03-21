// hooks/comments/useReplyPagination.ts
import { Comment, LaravelPagination } from '@/types/custom';
import { useState } from 'react';

type ReplyPagination = Record<number, LaravelPagination<Comment>>;

export const useReplyPagination = () => {
    const [replyPaginations, setReplyPaginations] = useState<ReplyPagination>(
        {},
    );

    // Update reply pagination with new data
    const updateReplyPaginationData = (
        commentId: number,
        data: LaravelPagination<Comment>,
    ) => {
        setReplyPaginations((prev) => ({
            ...prev,
            [commentId]: data,
        }));
    };

    // Add a single reply to pagination
    const updateReplyPagination = (parentId: number, reply: Comment) => {
        if (replyPaginations[parentId]) {
            setReplyPaginations((prev) => ({
                ...prev,
                [parentId]: {
                    ...prev[parentId],
                    total: prev[parentId].total + 1,
                    data: [...prev[parentId].data, reply],
                },
            }));
        } else {
            // Create new pagination data
            setReplyPaginations((prev) => ({
                ...prev,
                [parentId]: {
                    current_page: 1,
                    data: [reply],
                    first_page_url: '',
                    from: 1,
                    last_page: 1,
                    last_page_url: '',
                    links: [],
                    next_page_url: null,
                    path: '',
                    per_page: 10,
                    prev_page_url: null,
                    to: 1,
                    total: 1,
                },
            }));
        }
    };

    return {
        replyPaginations,
        updateReplyPaginationData,
        updateReplyPagination,
    };
};

export default useReplyPagination;
