// hooks/useChapterComments.ts
import { Chapter, Comment, LaravelPagination, User } from '@/types/custom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type ReplyPagination = Record<number, LaravelPagination<Comment>>;

const useChapterComments = (chapter: Chapter, currentUser: User) => {
    // Core state
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [replyPaginations, setReplyPaginations] = useState<ReplyPagination>(
        {},
    );
    const commentListRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

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

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            return axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                { content, chapter_id: chapter.id, parent_id: null },
            );
        },
        onSuccess: () => setNewComment(''),
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
            return axios.post(
                route('chapter.comment.store', { chapter_id: chapter.id }),
                { content, chapter_id: chapter.id, parent_id: commentId },
            );
        },
        onSuccess: (response) => {
            const newReply = response.data;

            // Update cache with new reply
            updateCacheWithNewReply(newReply);

            // Update reply pagination if it exists
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
        onError: () => toast.error('Failed to add reply'),
    });

    // Function to add a comment
    const addComment = (content: string) => {
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

    // Helper to update cache with new reply
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

    // Function to fetch parent comment and add a single reply
    const fetchParentWithReply = async (parentId: number, reply: Comment) => {
        try {
            const response = await axios.get(
                route('comments.get', { comment_id: parentId }),
            );
            const parentComment = response.data;

            // Update cache with parent and reply
            queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
                if (!oldData) return oldData;

                const updatedData = { ...oldData };
                const commentsList = [...updatedData.data];

                // Check if parent exists
                if (!commentsList.some((c) => c.id === parentId)) {
                    // Add parent and reply
                    commentsList.push(parentComment, reply);
                } else if (!commentsList.some((c) => c.id === reply.id)) {
                    // Add just the reply in the right position
                    updateCacheWithNewReply(reply);
                }

                updatedData.data = commentsList;
                return updatedData;
            });

            // Update pagination data
            updateReplyPagination(parentId, reply);
        } catch (error) {
            console.error('Error fetching parent comment:', error);
        }
    };

    // Function to fetch replies for a comment
    const fetchReplies = async (commentId: number, page = 1) => {
        try {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', { comment_id: commentId, page }),
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
                        (c) => c.parent_id !== commentId,
                    );
                    // Add new replies
                    commentsList = [...commentsList, ...data.data];
                } else {
                    // Add new replies without duplicates
                    const existingIds = new Set(commentsList.map((c) => c.id));
                    const newReplies = data.data.filter(
                        (r) => !existingIds.has(r.id),
                    );
                    commentsList = [...commentsList, ...newReplies];
                }

                updatedData.data = commentsList;
                return updatedData;
            });

            // Store pagination data
            setReplyPaginations((prev) => ({
                ...prev,
                [commentId]: data,
            }));
        } catch (error) {
            toast.error('Failed to load replies');
            console.error('Error fetching replies:', error);
        }
    };

    // Helper to update reply pagination
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

    // Pusher real-time updates
    useEffect(() => {
        const pusher = new Pusher(
            import.meta.env.VITE_PUSHER_APP_KEY || 'a53de8327fa510a204f6',
            {
                cluster: 'ap1',
                authEndpoint: '/broadcasting/auth',
            },
        );

        // Subscribe to channels
        const chapterChannel = pusher.subscribe(
            `private-chapter.${chapter.id}`,
        );
        const userChannel = pusher.subscribe(`private-user.${currentUser.id}`);

        // New comment handler
        const handleNewComment = (comment: Comment) => {
            queryClient.setQueryData(commentsQueryKey, (oldData: any) => {
                if (!oldData) return oldData;

                const updatedData = { ...oldData };
                // Add to beginning and update total
                updatedData.data = [comment, ...updatedData.data];
                updatedData.total = updatedData.total + 1;

                return updatedData;
            });

            // Scroll to top
            if (commentListRef.current) {
                commentListRef.current.scrollTop = 0;
            }
        };

        // Reply handler
        const handleNewReply = (reply: Comment) => {
            if (!reply.parent_id) return;

            // Check if we need to fetch parent
            const queryData =
                queryClient.getQueryData<LaravelPagination<Comment>>(
                    commentsQueryKey,
                );
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

        // Bind event handlers
        chapterChannel.bind(
            'comment.activity',
            (data: { comment: Comment; action: string }) => {
                if (data.action === 'new') {
                    handleNewComment(data.comment);
                } else if (data.action === 'reply') {
                    handleNewReply(data.comment);
                }
            },
        );

        userChannel.bind(
            'comment.activity',
            (data: { comment: Comment; action: string }) => {
                if (data.action === 'reply') {
                    handleNewReply(data.comment);
                }
            },
        );

        // Cleanup
        return () => {
            pusher.unsubscribe(`private-chapter.${chapter.id}`);
            pusher.unsubscribe(`private-user.${currentUser.id}`);
        };
    }, [chapter.id, currentUser.id, queryClient, commentsQueryKey]);

    return {
        // Data
        comments: commentsQuery.data?.data || [],
        commentPagination: commentsQuery.data,
        isLoading: commentsQuery.isLoading,
        isSubmitting:
            addCommentMutation.isPending || addReplyMutation.isPending,
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

export default useChapterComments
