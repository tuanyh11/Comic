// hooks/comments/useCommentMutations.ts
import { Chapter, LaravelPagination } from '@/types/custom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;

export const useCommentMutations = (
    chapter: Chapter,
    setNewComment: (comment: string) => void,
    commentsQueryKey: readonly unknown[],
    replyPaginations: ReplyPaginationsMap,
    setReplyPaginations: (
        fn: (prev: ReplyPaginationsMap) => ReplyPaginationsMap,
    ) => void,
) => {
    const queryClient = useQueryClient();

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            return axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                {
                    content,
                    chapter_id: chapter.id,
                    parent_id: null,
                },
            );
        },
        onSuccess: () => {
            setNewComment('');
            // We don't invalidate the query here as Pusher will handle updating the UI
        },
        onError: () => {
            toast.error('Failed to add comment');
        },
    });

    // Add reply mutation
    const addReplyMutation = useMutation({
        mutationFn: async ({
            commentId,
            replyText,
        }: {
            commentId: number;
            replyText: string;
        }) => {
            return axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                {
                    content: replyText,
                    chapter_id: chapter.id,
                    parent_id: commentId,
                },
            );
        },
        onSuccess: (response) => {
            const newReply = response.data;

            // Manually update the comment in the cache
            queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
                if (!oldData) return oldData;

                // Add the new reply to the appropriate position in the data array
                const updatedData = { ...oldData };
                const commentsList = [...updatedData.data];

                // Find parent comment's position
                const parentIndex = commentsList.findIndex(
                    (c) => c.id === newReply.parent_id,
                );

                if (parentIndex !== -1) {
                    // Find last reply to insert after
                    let insertIndex = parentIndex;
                    for (
                        let i = parentIndex + 1;
                        i < commentsList.length;
                        i++
                    ) {
                        if (commentsList[i].parent_id === newReply.parent_id) {
                            insertIndex = i;
                        } else if (!commentsList[i].parent_id) {
                            break;
                        }
                    }

                    // Insert at the right position
                    commentsList.splice(insertIndex + 1, 0, newReply);
                    updatedData.data = commentsList;
                }

                return updatedData;
            });

            // Update pagination data if it exists
            if (replyPaginations[newReply.parent_id]) {
                setReplyPaginations((prev) => ({
                    ...prev,
                    [newReply.parent_id]: {
                        ...prev[newReply.parent_id],
                        total: prev[newReply.parent_id].total + 1,
                        data: [...prev[newReply.parent_id].data, newReply],
                    },
                }));
            }
        },
        onError: () => {
            toast.error('Failed to add reply');
        },
    });

    // Function to add a comment
    const addComment = (commentText: string) => {
        if (commentText.trim() && !addCommentMutation.isLoading) {
            addCommentMutation.mutate(commentText);
        }
    };

    // Function to add a reply
    const addReply = (commentId: number, replyText: string) => {
        if (replyText.trim() && !addReplyMutation.isLoading) {
            addReplyMutation.mutate({ commentId, replyText });
        }
    };

    return {
        addComment,
        addReply,
        isSubmitting:
            addCommentMutation.isLoading || addReplyMutation.isLoading,
    };
};