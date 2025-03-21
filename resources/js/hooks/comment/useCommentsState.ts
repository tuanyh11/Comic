// hooks/comments/useCommentsState.ts
import { Comment, LaravelPagination } from '@/types/custom';
import { useRef, useState } from 'react';

// Type for mapping comment IDs to their pagination data
type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;

export const useCommentsState = () => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const commentListRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [alwaysShowReplies, setAlwaysShowReplies] = useState(true);
    const [replyPaginations, setReplyPaginations] =
        useState<ReplyPaginationsMap>({});

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const shouldShowReplies = () => {
        return alwaysShowReplies;
    };

    return {
        showComments,
        setShowComments,
        newComment,
        setNewComment,
        commentListRef,
        currentPage,
        setCurrentPage,
        alwaysShowReplies,
        setAlwaysShowReplies,
        replyPaginations,
        setReplyPaginations,
        toggleComments,
        shouldShowReplies,
    };
};
