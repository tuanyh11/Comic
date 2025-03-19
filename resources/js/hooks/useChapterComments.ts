import { Chapter, Comment, LaravelPagination, User } from '@/types/custom';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Type for mapping comment IDs to their pagination data
type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;

const useChapterComments = (chapter: Chapter, currentUser: User) => {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentListRef = useRef<HTMLDivElement>(null);
    const [commentPagination, setCommentPagination] =
        useState<LaravelPagination<Comment> | null>(null);
    const [replyPaginations, setReplyPaginations] =
        useState<ReplyPaginationsMap>({});
    const [currentPage, setCurrentPage] = useState(1);

    // Keep track of all comments that should always have visible replies
    // This is a simple solution that ALWAYS shows replies - they're never closed
    const [alwaysShowReplies, setAlwaysShowReplies] = useState(true);

    // Initialize Pusher
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

        // Subscribe to the user's personal channel for receiving replies
        const userChannel = pusher.subscribe(`private-user.${currentUser.id}`);

        // Listen for new comments on chapter channel
        chapterChannel.bind(
            'comment.activity',
            (data: { comment: Comment; action: string; timestamp: string }) => {
                console.log('Activity on chapter channel:', data);
                if (data.action === 'new') {
                    setComments((prevComments) => [
                        data.comment,
                        ...prevComments,
                    ]);

                    // Update total count in pagination
                    if (commentPagination) {
                        setCommentPagination({
                            ...commentPagination,
                            total: commentPagination.total + 1,
                        });
                    }

                    // Scroll to top of comment list where new comment appears
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

            console.log('====================================');
            console.log(comment);
            console.log('====================================');
            // Check if parent comment exists in our state
            const parentExists = comments.some(
                (c) => c.id === comment.parent_id,
            );

            // Check if this reply already exists in our state
            const replyExists = comments.some((c) => c.id === comment.id);

            if (replyExists) {
                console.log('Reply already exists in state, skipping');
                return;
            }

            if (parentExists) {
                // If we've loaded the parent comment, add this reply
                setComments((prevComments) => {
                    // Find the index where to insert the reply (after the parent or after last sibling)
                    const parentIndex = prevComments.findIndex(
                        (c) => c.id === comment.parent_id,
                    );

                    if (parentIndex === -1) return [...prevComments, comment];

                    // Find the last reply to this parent
                    let insertIndex = parentIndex;
                    for (
                        let i = parentIndex + 1;
                        i < prevComments.length;
                        i++
                    ) {
                        if (prevComments[i].parent_id === comment.parent_id) {
                            insertIndex = i;
                        } else if (!prevComments[i].parent_id) {
                            // We've reached a new parent comment, stop here
                            break;
                        }
                    }

                    // Create a new array with the reply inserted at the right position
                    const result = [
                        ...prevComments.slice(0, insertIndex + 1),
                        comment,
                        ...prevComments.slice(insertIndex + 1),
                    ];

                    return result;
                });

                if (replyPaginations[comment.parent_id]) {
                    setReplyPaginations((prev) => ({
                        ...prev,
                        [String(comment.parent_id)]: {
                            ...prev[comment.parent_id!],
                            total: prev[comment.parent_id!].total + 1,
                            data: [...prev[comment.parent_id!].data, comment],
                        },
                    }));
                }
            } else {
                // IMPORTANT: Instead of fetching all replies for the parent,
                // we'll just fetch the parent comment itself and add this reply
                // This prevents replies from being re-fetched and collapsed
                fetchParentOnly(comment.parent_id, comment);
            }
        };

        // Fetch initial comments
        fetchComments(1);

        return () => {
            // Cleanup
            pusher.unsubscribe(`private-chapter.${chapter.id}`);
            pusher.unsubscribe(`private-user.${currentUser.id}`);
        };
    }, [chapter.id, currentUser.id]);

    // Fetch a parent comment and its replies
    const fetchParentWithReplies = async (parentId: number) => {
        try {
            // First fetch the parent comment
            const parentResponse = await axios.get(
                route('comments.get', { comment_id: parentId }),
            );

            // Then fetch its replies
            const repliesResponse = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', {
                    comment_id: parentId,
                    page: 1,
                }),
            );

            const parentComment = parentResponse.data;
            const repliesData = repliesResponse.data;

            // Add parent and replies to state
            setComments((prev) => {
                // First check if parent already exists
                if (prev.some((c) => c.id === parentId)) {
                    return prev;
                }

                // Add parent and all replies
                return [...prev, parentComment, ...repliesData.data];
            });

            // Store pagination data
            setReplyPaginations((prev) => ({
                ...prev,
                [parentId]: repliesData,
            }));
        } catch (error) {
            console.error('Error fetching parent comment and replies:', error);
        }
    };

    // Fetch ONLY the parent comment and add a single reply
    // This prevents re-fetching all replies which might cause them to collapse
    const fetchParentOnly = async (parentId: number, replyComment: Comment) => {
        try {
            // Fetch only the parent comment
            const parentResponse = await axios.get(
                route('comments.get', { comment_id: parentId }),
            );

            const parentComment = parentResponse.data;

            // Add parent and the single reply to state
            setComments((prev) => {
                // First check if parent already exists
                if (prev.some((c) => c.id === parentId)) {
                    // If parent exists but we're here, it means we need to add the reply
                    if (!prev.some((c) => c.id === replyComment.id)) {
                        // Find the right position to insert the reply
                        const parentIndex = prev.findIndex(
                            (c) => c.id === parentId,
                        );
                        if (parentIndex !== -1) {
                            let insertIndex = parentIndex;
                            for (
                                let i = parentIndex + 1;
                                i < prev.length;
                                i++
                            ) {
                                if (prev[i].parent_id === parentId) {
                                    insertIndex = i;
                                } else if (!prev[i].parent_id) {
                                    break;
                                }
                            }
                            return [
                                ...prev.slice(0, insertIndex + 1),
                                replyComment,
                                ...prev.slice(insertIndex + 1),
                            ];
                        }
                    }
                    return prev;
                }

                // Add parent and only this single reply
                return [...prev, parentComment, replyComment];
            });

            // Update pagination data if it exists
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
                // Create new pagination data with just this reply
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

    const toggleComments = () => {
        setShowComments(!showComments);
        if (!showComments && comments.length === 0) {
            fetchComments(1);
        }
    };

    // Fetch comments with pagination
    const fetchComments = async (page = 1) => {
        try {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('chapter.comments', {
                    chapter_id: chapter.id,
                    page: page,
                }),
            );

            const data = response.data;

            if (page === 1) {
                setComments(data.data);
            } else {
                // Append new comments to existing ones
                setComments((prevComments) => [...prevComments, ...data.data]);
            }

            // Store pagination data
            setCommentPagination(data);
            setCurrentPage(data.current_page);
        } catch (error) {
            toast.error('Failed to load comments');
            console.error('Error fetching comments:', error);
        }
    };

    // Load more comments (parent comments)
    const loadMoreComments = async () => {
        if (commentPagination && currentPage < commentPagination.last_page) {
            const nextPage = currentPage + 1;
            await fetchComments(nextPage);
        }
    };

    // Fetch replies for a specific comment
    const fetchReplies = async (commentId: number, page = 1) => {
        try {
            setIsSubmitting(true);
            const response = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', {
                    comment_id: commentId,
                    page: page,
                }),
            );

            const data = response.data;

            // Update replies in the comments state
            setComments((prevComments) => {
                if (page === 1) {
                    // For first page, remove any existing replies for this parent
                    const withoutExistingReplies = prevComments.filter(
                        (comment) => comment.parent_id !== commentId,
                    );
                    return [...withoutExistingReplies, ...data.data];
                } else {
                    // For subsequent pages, add new replies but avoid duplicates
                    const existingIds = new Set(
                        prevComments.map((comment) => comment.id),
                    );
                    const newReplies = data.data.filter(
                        (reply) => !existingIds.has(reply.id),
                    );
                    return [...prevComments, ...newReplies];
                }
            });

            // Store pagination data for this parent comment
            setReplyPaginations((prev) => ({
                ...prev,
                [commentId]: data,
            }));
        } catch (error) {
            toast.error('Failed to load replies');
            console.error('Error fetching replies:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Load more replies for a specific comment
    const loadMoreReplies = (commentId: number, page: number) => {
        fetchReplies(commentId, page);
    };

    // Add comment using axios
    const addComment = async () => {
        if (newComment.trim() && !isSubmitting) {
            setIsSubmitting(true);

            try {
                await axios.post(
                    route('chapter.comment.store', { chapter_id: chapter.id }),
                    {
                        content: newComment,
                        chapter_id: chapter.id,
                        parent_id: null,
                    },
                );

                setNewComment('');
                // Comment will be added via Pusher
            } catch (error) {
                console.error('Failed to add comment:', error);
                toast.error('Failed to add comment');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Add reply using axios
    const addReply = async (commentId: number, replyText: string) => {
        if (replyText.trim() && !isSubmitting) {
            setIsSubmitting(true);

            try {
                const response = await axios.post(
                    route('chapter.comment.store', { chapter_id: chapter.id }),
                    {
                        content: replyText,
                        chapter_id: chapter.id,
                        parent_id: commentId,
                    },
                );

                // Instead of waiting for Pusher events, manually add the reply to the state
                const newReply = response.data;

                if (newReply) {
                    // Add the new reply to the comments array directly
                    setComments((prevComments) => {
                        // Find parent comment's position
                        const parentIndex = prevComments.findIndex(
                            (c) => c.id === commentId,
                        );

                        if (parentIndex === -1)
                            return [...prevComments, newReply];

                        // Find last reply to this parent to insert after it
                        let insertIndex = parentIndex;
                        for (
                            let i = parentIndex + 1;
                            i < prevComments.length;
                            i++
                        ) {
                            if (prevComments[i].parent_id === commentId) {
                                insertIndex = i;
                            } else if (!prevComments[i].parent_id) {
                                break;
                            }
                        }

                        // Insert new reply at the right position
                        return [
                            ...prevComments.slice(0, insertIndex + 1),
                            newReply,
                            ...prevComments.slice(insertIndex + 1),
                        ];
                    });

                    // Update pagination data if it exists
                    if (replyPaginations[commentId]) {
                        setReplyPaginations((prev) => ({
                            ...prev,
                            [commentId]: {
                                ...prev[commentId],
                                total: prev[commentId].total + 1,
                                data: [...prev[commentId].data, newReply],
                            },
                        }));
                    }
                }

                // Do NOT fetch replies here - this is the key change
                // We'll let Pusher handle any additional updates
            } catch (error) {
                console.error('Failed to add reply:', error);
                toast.error('Failed to add reply');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Function to check if replies should be shown - always returns true
    // This ensures replies are always visible and never hidden
    const shouldShowReplies = () => {
        return alwaysShowReplies;
    };

    return {
        showComments,
        comments,
        newComment,
        setNewComment,
        isSubmitting,
        commentListRef,
        toggleComments,
        addComment,
        addReply,
        loadMoreComments,
        loadMoreReplies,
        commentPagination,
        replyPaginations,
        shouldShowReplies, // Add this to your component interface
        setAlwaysShowReplies, // This can be used to toggle all replies on/off if needed
    };
};

export default useChapterComments;
