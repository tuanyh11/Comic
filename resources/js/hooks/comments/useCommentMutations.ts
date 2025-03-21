// hooks/comments/useCommentMutations.ts
import { Chapter, Comment } from '@/types/custom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useCommentMutations = (
    chapter: Chapter,
    onCommentSuccess?: () => void,
    onReplySuccess?: (reply: Comment) => void,
) => {
    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                { content, chapter_id: chapter.id, parent_id: null },
            );
            return response.data;
        },
        onSuccess: () => {
            if (onCommentSuccess) {
                onCommentSuccess();
            }
        },
        onError: () => toast.error('Failed to add comment'),
    });

    // Add reply mutation
    const addReplyMutation = useMutation({
        mutationFn: async ({
            commentId,
            content,
        }: {
            commentId: number;
            content: string;
        }) => {
            const response = await axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                { content, chapter_id: chapter.id, parent_id: commentId },
            );
            return response.data;
        },
        onSuccess: (newReply) => {
            if (onReplySuccess) {
                onReplySuccess(newReply);
            }
        },
        onError: () => toast.error('Failed to add reply'),
    });

    // Function to add a comment
    const addComment = (content: string) => {
        console.log('====================================');
        console.log(content);
        console.log('====================================');
        if (content.trim() && !addCommentMutation.isPending) {
            addCommentMutation.mutate(content);
        }
    };

    // Function to add a reply
    const addReply = (commentId: number, content: string) => {
        if (content.trim() && !addReplyMutation.isPending) {
            addReplyMutation.mutate({ commentId, content });
        }
    };

    return {
        addCommentMutation,
        addReplyMutation,
        addComment,
        addReply,
        isSubmitting:
            addCommentMutation.isPending || addReplyMutation.isPending,
    };
};

export default useCommentMutations;
