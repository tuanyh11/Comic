// hooks/comments/useCacheUpdates.ts
import { Comment } from '@/types/custom';
import { useQueryClient } from '@tanstack/react-query';

export const useCacheUpdates = (commentsQueryKey: any[]) => {
    const queryClient = useQueryClient();

    // Update cache with new reply
    const updateCacheWithNewReply = (reply: Comment) => {
        queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
            if (!oldData) return oldData;

            const updatedData = { ...oldData };
            const commentsList = [...updatedData.data];

            // Find parent comment's position
            const parentIndex = commentsList.findIndex(
                (c) => c.id === reply.parent_id,
            );

            if (parentIndex !== -1) {
                // Find last sibling reply to insert after
                let insertIndex = parentIndex;
                for (let i = parentIndex + 1; i < commentsList.length; i++) {
                    if (commentsList[i].parent_id === reply.parent_id) {
                        insertIndex = i;
                    } else if (!commentsList[i].parent_id) {
                        break;
                    }
                }

                // Insert at the right position
                commentsList.splice(insertIndex + 1, 0, reply);
                updatedData.data = commentsList;
            }

            return updatedData;
        });
    };

    // Update cache with parent and reply
    const updateCacheWithParentAndReply = (
        parentComment: Comment,
        reply: Comment,
    ) => {
        queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
            if (!oldData) return oldData;

            const updatedData = { ...oldData };
            const commentsList = [...updatedData.data];

            // Check if parent exists
            if (!commentsList.some((c) => c.id === parentComment.id)) {
                // Add parent and reply
                commentsList.push(parentComment, reply);
            } else if (!commentsList.some((c) => c.id === reply.id)) {
                // Add just the reply in the right position
                updateCacheWithNewReply(reply);
            }

            updatedData.data = commentsList;
            return updatedData;
        });
    };

    // Update cache with new comment (typically at the top)
    const updateCacheWithNewComment = (comment: Comment) => {
        queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
            if (!oldData) return oldData;

            const updatedData = { ...oldData };
            // Add to beginning and update total
            updatedData.data = [comment, ...updatedData.data];
            updatedData.total = updatedData.total + 1;

            return updatedData;
        });
    };

    // Update cache with new replies page
    const updateCacheWithReplies = (
        commentId: number,
        replies: Comment[],
        page: number,
    ) => {
        queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
            if (!oldData) return oldData;

            const updatedData = { ...oldData };
            let commentsList = [...updatedData.data];

            if (page === 1) {
                // Remove existing replies for this parent
                commentsList = commentsList.filter(
                    (c) => c.parent_id !== commentId,
                );
                // Add new replies
                commentsList = [...commentsList, ...replies];
            } else {
                // Add new replies without duplicates
                const existingIds = new Set(commentsList.map((c) => c.id));
                const newReplies = replies.filter(
                    (r) => !existingIds.has(r.id),
                );
                commentsList = [...commentsList, ...newReplies];
            }

            updatedData.data = commentsList;
            return updatedData;
        });
    };

    return {
        updateCacheWithNewReply,
        updateCacheWithParentAndReply,
        updateCacheWithNewComment,
        updateCacheWithReplies,
    };
};

export default useCacheUpdates;
