// hooks/comments/useRepliesManagement.ts

import { LaravelPagination } from '@/types/custom';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;

export const useRepliesManagement = (
    commentsQueryKey: any[],
    replyPaginations: ReplyPaginationsMap,
    setReplyPaginations: (
        fn: (prev: ReplyPaginationsMap) => ReplyPaginationsMap,
    ) => void,
) => {
    const queryClient = useQueryClient();

    // Function to fetch replies for a comment
    const fetchReplies = async (commentId: number, page = 1) => {
        try {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', {
                    comment_id: commentId,
                    page: page,
                }),
            );

            const data = response.data;

            // Update cache with new replies
            queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
                if (!oldData) return oldData;

                const updatedData = { ...oldData };
                let commentsList = [...updatedData.data];

                if (page === 1) {
                    // Remove existing replies for this parent
                    commentsList = commentsList.filter(
                        (comment) => comment.parent_id !== commentId,
                    );
                    // Add new replies
                    commentsList = [...commentsList, ...data.data];
                } else {
                    // For subsequent pages, add new replies without duplicates
                    const existingIds = new Set(
                        commentsList.map((comment) => comment.id),
                    );
                    const newReplies = data.data.filter(
                        (reply) => !existingIds.has(reply.id),
                    );
                    commentsList = [...commentsList, ...newReplies];
                }

                updatedData.data = commentsList;
                return updatedData;
            });

            // Store pagination data for this parent comment
            setReplyPaginations((prev) => ({
                ...prev,
                [commentId]: data,
            }));
        } catch (error) {
            toast.error('Failed to load replies');
            console.error('Error fetching replies:', error);
        }
    };

    // Fetch ONLY the parent comment and add a single reply
    const fetchParentOnly = async (parentId: number, replyComment: Comment) => {
        try {
            const parentResponse = await axios.get(
                route('comments.get', { comment_id: parentId }),
            );

            const parentComment = parentResponse.data;

            // Update cache with parent and reply
            queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
                if (!oldData) return oldData;

                const updatedData = { ...oldData };
                const commentsList = [...updatedData.data];

                // Check if parent already exists
                if (commentsList.some((c) => c.id === parentId)) {
                    // If parent exists, just add the reply if it's not there already
                    if (!commentsList.some((c) => c.id === replyComment.id)) {
                        const parentIndex = commentsList.findIndex(
                            (c) => c.id === parentId,
                        );
                        if (parentIndex !== -1) {
                            let insertIndex = parentIndex;
                            for (
                                let i = parentIndex + 1;
                                i < commentsList.length;
                                i++
                            ) {
                                if (commentsList[i].parent_id === parentId) {
                                    insertIndex = i;
                                } else if (!commentsList[i].parent_id) {
                                    break;
                                }
                            }
                            commentsList.splice(
                                insertIndex + 1,
                                0,
                                replyComment,
                            );
                        }
                    }
                } else {
                    // Add parent and the single reply
                    commentsList.push(parentComment, replyComment);
                }

                updatedData.data = commentsList;
                return updatedData;
            });

            // Update pagination data
            if (replyPaginations[parentId]) {
                setReplyPaginations((prev) => ({
                    ...prev,
                    [parentId]: {
                        ...prev[parentId],
                        total: prev[parentId].total + 1,
                        data: [...prev[parentId].data, replyComment],
                    },
                }));
            } else {
                // Create new pagination data
                setReplyPaginations((prev) => ({
                    ...prev,
                    [parentId]: {
                        current_page: 1,
                        data: [replyComment],
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
        } catch (error) {
            console.error('Error fetching parent comment:', error);
        }
    };

    // Function to load more replies for a specific comment
    const loadMoreReplies = (commentId: number, page: number) => {
        fetchReplies(commentId, page);
    };

    return {
        fetchReplies,
        fetchParentOnly,
        loadMoreReplies,
    };
};
