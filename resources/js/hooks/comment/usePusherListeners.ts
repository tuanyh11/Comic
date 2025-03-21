// hooks/comments/usePusherListeners.ts
import { Chapter, Comment, LaravelPagination, User } from '@/types/custom';
import { useQueryClient } from '@tanstack/react-query';
import Pusher from 'pusher-js';
import { useEffect } from 'react';

// Định nghĩa type cho dữ liệu query
type CommentsPagination = LaravelPagination<Comment>;

export const usePusherListeners = (
    chapter: Chapter,
    currentUser: User,
    commentsQueryKey: readonly unknown[],
    commentListRef: React.RefObject<HTMLDivElement>,
    fetchParentOnly: (parentId: number, replyComment: Comment) => Promise<void>,
) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const pusher = new Pusher(
            import.meta.env.VITE_PUSHER_APP_KEY || 'a53de8327fa510a204f6',
            {
                cluster: 'ap1',
                authEndpoint: '/broadcasting/auth',
            },
        );

        // Subscribe to the chapter-specific channel
        const chapterChannel = pusher.subscribe(
            `private-chapter.${chapter.id}`,
        );

        // Subscribe to the user's personal channel
        const userChannel = pusher.subscribe(`private-user.${currentUser.id}`);

        // Listen for new comments on chapter channel
        chapterChannel.bind(
            'comment.activity',
            (data: { comment: Comment; action: string; timestamp: string }) => {
                console.log('Activity on chapter channel:', data);
                if (data.action === 'new') {
                    // Update the cache with the new comment
                    queryClient.setQueryData<CommentsPagination | undefined>(
                        commentsQueryKey,
                        (oldData) => {
                            if (!oldData) return oldData;

                            const updatedData = { ...oldData };
                            // Add new comment to the beginning
                            updatedData.data = [
                                data.comment,
                                ...updatedData.data,
                            ];
                            // Increment total count
                            updatedData.total = updatedData.total + 1;

                            return updatedData;
                        },
                    );

                    // Scroll to top of comment list
                    if (commentListRef.current) {
                        commentListRef.current.scrollTop = 0;
                    }
                }
                if (data.action === 'reply') {
                    // Handle case where reply event is sent to chapter channel
                    handleNewReply(data.comment);
                }
            },
        );

        // Listen for replies to your comments on user channel
        userChannel.bind(
            'comment.activity',
            (data: { comment: Comment; action: string; timestamp: string }) => {
                console.log('Activity on user channel:', data);

                if (data.action === 'reply') {
                    handleNewReply(data.comment);
                }
            },
        );

        // Function to handle new replies from either channel
        const handleNewReply = (comment: Comment) => {
            if (!comment.parent_id) return;

            // Check if we need to fetch parent
            const queryData =
                queryClient.getQueryData<CommentsPagination>(commentsQueryKey);

            if (!queryData) return;

            const currentComments = queryData.data;
            const parentExists = currentComments.some(
                (c) => c.id === comment.parent_id,
            );
            const replyExists = currentComments.some(
                (c) => c.id === comment.id,
            );

            if (replyExists) {
                console.log('Reply already exists in state, skipping');
                return;
            }

            if (parentExists) {
                // Update cache with the new reply
                queryClient.setQueryData<CommentsPagination | undefined>(
                    commentsQueryKey,
                    (oldData) => {
                        if (!oldData) return oldData;

                        const updatedData = { ...oldData };
                        const commentsList = [...updatedData.data];

                        // Find parent position and insert reply after last sibling
                        const parentIndex = commentsList.findIndex(
                            (c) => c.id === comment.parent_id,
                        );
                        if (parentIndex === -1) {
                            commentsList.push(comment);
                        } else {
                            let insertIndex = parentIndex;
                            for (
                                let i = parentIndex + 1;
                                i < commentsList.length;
                                i++
                            ) {
                                if (
                                    commentsList[i].parent_id ===
                                    comment.parent_id
                                ) {
                                    insertIndex = i;
                                } else if (!commentsList[i].parent_id) {
                                    break;
                                }
                            }

                            commentsList.splice(insertIndex + 1, 0, comment);
                        }

                        updatedData.data = commentsList;
                        return updatedData;
                    },
                );
            } else {
                // Fetch parent if it doesn't exist
                fetchParentOnly(comment.parent_id, comment);
            }
        };

        return () => {
            // Cleanup
            pusher.unsubscribe(`private-chapter.${chapter.id}`);
            pusher.unsubscribe(`private-user.${currentUser.id}`);
        };
    }, [
        chapter.id,
        currentUser.id,
        queryClient,
        commentsQueryKey,
        commentListRef,
        fetchParentOnly,
    ]);
};
