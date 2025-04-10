import { Chapter, Comment, LaravelPagination, User } from '@/types/custom';
import {
    InfiniteData,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Types
type ReplyPaginationsMap = Record<number, LaravelPagination<Comment>>;
interface CommentsResponse {
    comment: Comment;
    message: string;
}
type CommentsInfiniteData = InfiniteData<LaravelPagination<Comment>>;

const useChapterComments = (chapter: Chapter, currentUser: User) => {
    // State
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyPaginations, setReplyPaginations] =
        useState<ReplyPaginationsMap>({});
    const commentListRef = useRef<HTMLDivElement>(null);
    const pusherRef = useRef<Pusher | null>(null);
    const queryClient = useQueryClient();
    const commentsQueryKey = ['comments', chapter.id] as const;

    // ==================== UI Actions ====================
    const toggleComments = () => {
        setShowComments(!showComments);

        // Scroll to top when opening comments
        const shouldScrollToTop = !showComments && commentListRef.current;
        if (shouldScrollToTop) {
            setTimeout(() => {
                if (commentListRef.current) {
                    commentListRef.current.scrollTop = 0;
                }
            }, 100);
        }
    };

    // ==================== Data Fetching ====================
    const {
        data: commentPagination,
        fetchNextPage,
        hasNextPage,
        isFetching: isLoading,
    } = useInfiniteQuery({
        queryKey: commentsQueryKey,
        queryFn: fetchCommentsPage,
        getNextPageParam: getNextCommentsPage,
        enabled: showComments,
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        staleTime: 10000,
    });

    // Get flattened comments
    const comments =
        commentPagination?.pages?.flatMap((page) => page.data) || [];

    // ==================== Mutations ====================
    const addCommentMutation = useMutation({
        mutationFn: createComment,
        onSuccess: handleCommentSuccess,
        onError: () => toast.error('Lỗi khi thêm comment'),
    });

    const addReplyMutation = useMutation({
        mutationFn: createReply,
        onSuccess: handleReplySuccess,
        onError: () => toast.error('Lỗi khi trả lời comment'),
    });

    // ==================== User Interactions ====================
    const addComment = () =>
        newComment.trim() &&
        !addCommentMutation.isPending &&
        addCommentMutation.mutate(newComment);

    const addReply = (commentId: number, content: string) =>
        content.trim() &&
        !addReplyMutation.isPending &&
        addReplyMutation.mutate({ commentId, content });

    const loadMoreComments = () => hasNextPage && !isLoading && fetchNextPage();

    const loadMoreReplies = (commentId: number, page: number) => {
        fetchReplies(commentId, page);
    };

    // ==================== Fetching Functions ====================
    // Higher-order function để xử lý try-catch
    const withErrorHandling = async <T>(
        fn: () => Promise<T>,
        errorMessage: string,
    ): Promise<T> => {
        try {
            return await fn();
        } catch (error) {
            toast.error(errorMessage);
            throw error;
        }
    };

    async function fetchCommentsPage({
        pageParam = 1,
    }: {
        pageParam?: number;
    }) {
        return withErrorHandling(async () => {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('chapter.comments', {
                    chapter_id: chapter.id,
                    page: pageParam,
                }),
            );
            return response.data;
        }, 'Lỗi khi tải bình luận');
    }

    function getNextCommentsPage(lastPage: LaravelPagination<Comment>) {
        const hasNextPage = lastPage.current_page < lastPage.last_page;
        return hasNextPage ? lastPage.current_page + 1 : undefined;
    }

    // ==================== Comment Creation ====================
    async function createComment(content: string) {
        return axios.post<CommentsResponse>(
            route('chapter.comment.store', { chapter_id: chapter.id }),
            { content, chapter_id: chapter.id, parent_id: null },
        );
    }

    function handleCommentSuccess(response: AxiosResponse<CommentsResponse>) {
        setNewComment('');
        const newComment = response.data.comment;
        if (newComment) {
            handleNewComment(newComment);
        }
    }

    // ==================== Reply Creation ====================
    async function createReply({
        commentId,
        content,
    }: {
        commentId: number;
        content: string;
    }) {
        return axios.post<CommentsResponse>(
            route('chapter.comment.store', { chapter_id: chapter.id }),
            { content, chapter_id: chapter.id, parent_id: commentId },
        );
    }

    function handleReplySuccess(response: AxiosResponse<CommentsResponse>) {
        const newReply = response.data.comment;
        if (!newReply?.parent_id) {
            return;
        }

        const parentId = newReply.parent_id;
        const repliesLoaded = Boolean(replyPaginations[parentId]);

        repliesLoaded
            ? addReplyToLoadedParent(newReply)
            : fetchReplies(parentId, 1);
    }

    // ==================== Comment Management ====================
    const handleNewComment = (comment: Comment) => {
        queryClient.setQueryData<CommentsInfiniteData | undefined>(
            commentsQueryKey,
            (oldData) =>
                !oldData
                    ? oldData
                    : {
                          ...oldData,
                          pages: [
                              {
                                  ...oldData.pages[0],
                                  data: [comment, ...oldData.pages[0].data],
                                  total: oldData.pages[0].total + 1,
                              },
                              ...oldData.pages.slice(1),
                          ],
                      },
        );

        // Scroll to top after adding new comment
        commentListRef.current && (commentListRef.current.scrollTop = 0);
    };

    const handleNewReply = (comment: Comment) => {
        // Early return nếu không có parent_id
        if (!comment.parent_id) return;

        const parentId = comment.parent_id;
        const parentExists = comments.some((c) => c.id === parentId);

        // Sử dụng toán tử logic thay thế if/else
        !parentExists
            ? fetchParentAndReply(parentId, comment)
            : !replyPaginations[parentId]
              ? fetchReplies(parentId, 1)
              : !replyPaginations[parentId].data.some(
                    (r) => r.id === comment.id,
                ) && addReplyToLoadedParent(comment);
    };

    const addReplyToLoadedParent = (reply: Comment) => {
        if (!reply.parent_id) {
            return;
        }

        const replyExists = comments.some((c) => c.id === reply.id);
        if (replyExists) {
            return;
        }

        updateReplyPaginationState(reply);
        updateQueryCacheWithReply(reply);
    };

    // ==================== Helper Functions ====================
    const createInitialPagination = (
        data: Comment[],
    ): LaravelPagination<Comment> => ({
        current_page: 1,
        data,
        first_page_url: '',
        from: 1,
        last_page: 1,
        last_page_url: '',
        links: [],
        next_page_url: null,
        path: '',
        per_page: 3,
        prev_page_url: null,
        to: data.length,
        total: data.length,
    });

    const updateReplyPaginationState = (reply: Comment) => {
        if (!reply.parent_id) {
            return;
        }

        const parentId = reply.parent_id;

        setReplyPaginations((prev) => {
            const hasExistingPagination = Boolean(prev[parentId]);

            if (!hasExistingPagination) {
                return {
                    ...prev,
                    [parentId]: createInitialPagination([reply]),
                };
            }

            return {
                ...prev,
                [parentId]: {
                    ...prev[parentId],
                    total: prev[parentId].total + 1,
                    data: [...prev[parentId].data, reply],
                },
            };
        });
    };

    const updateQueryCacheWithReply = (reply: Comment) => {
        // Early return nếu không có parent_id
        if (!reply.parent_id) return;

        queryClient.setQueryData<CommentsInfiniteData | undefined>(
            commentsQueryKey,
            (oldData) => {
                // Early returns
                if (!oldData) return oldData;

                const parentId = reply.parent_id!;
                const pageWithParent = oldData.pages.findIndex((page) =>
                    page.data.some((c) => c.id === parentId),
                );

                if (pageWithParent === -1) return oldData;

                // Tạo pages mới
                return {
                    ...oldData,
                    pages: oldData.pages.map((page, pageIndex) =>
                        pageIndex !== pageWithParent
                            ? page
                            : (() => {
                                  const parentIndex = page.data.findIndex(
                                      (c) => c.id === parentId,
                                  );
                                  const newData = [...page.data];
                                  newData.splice(parentIndex + 1, 0, reply);
                                  return { ...page, data: newData };
                              })(),
                    ),
                };
            },
        );
    };

    // ==================== Replies Management ====================
    const fetchReplies = async (commentId: number, page = 1) => {
        return withErrorHandling(async () => {
            const response = await axios.get<LaravelPagination<Comment>>(
                route('comments.replies', {
                    comment_id: commentId,
                    page: page,
                }),
            );

            const data = response.data;
            setReplyPaginations((prev) => ({
                ...prev,
                [commentId]: data,
            }));

            updateQueryCacheWithReplies(commentId, data, page);
            return data;
        }, 'Failed to load replies');
    };

    const updateQueryCacheWithReplies = (
        parentId: number,
        data: LaravelPagination<Comment>,
        page: number,
    ) => {
        queryClient.setQueryData<CommentsInfiniteData | undefined>(
            commentsQueryKey,
            (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                const isFirstPage = page === 1;

                if (isFirstPage) {
                    return updateFirstPageReplies(oldData, parentId, data);
                }

                return appendNewReplies(oldData, data);
            },
        );
    };

    const updateFirstPageReplies = (
        oldData: CommentsInfiniteData,
        parentId: number,
        repliesData: LaravelPagination<Comment>,
    ) => {
        const newComments = [...comments];

        const withoutExistingReplies = newComments.filter(
            (comment) => comment.parent_id !== parentId,
        );

        const parentIndex = newComments.findIndex((c) => c.id === parentId);
        if (parentIndex === -1) {
            return updateWithoutParent(
                oldData,
                withoutExistingReplies,
                repliesData,
            );
        }
        // Sắp xếp replies theo thứ tự mới nhất lên đầu
        const sortedReplies = [...repliesData.data];

        return {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
                if (i === 0) {
                    return {
                        ...page,
                        data: [
                            ...withoutExistingReplies.slice(0, parentIndex + 1),
                            ...sortedReplies,
                            ...withoutExistingReplies.slice(parentIndex + 1),
                        ],
                    };
                }
                return page;
            }),
        };
    };

    const updateWithoutParent = (
        oldData: CommentsInfiniteData,
        withoutExistingReplies: Comment[],
        repliesData: LaravelPagination<Comment>,
    ) => {
        return {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
                if (i === 0) {
                    return {
                        ...page,
                        data: [...withoutExistingReplies, ...repliesData.data],
                    };
                }
                return page;
            }),
        };
    };

    const appendNewReplies = (
        oldData: CommentsInfiniteData,
        repliesData: LaravelPagination<Comment>,
    ) => {
        const existingIds = new Set(comments.map((comment) => comment.id));
        const newReplies = repliesData.data.filter(
            (reply) => !existingIds.has(reply.id),
        );

        return {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
                if (i === 0) {
                    return {
                        ...page,
                        data: [...page.data, ...newReplies],
                    };
                }
                return page;
            }),
        };
    };

    const fetchParentAndReply = async (
        parentId: number,
        replyComment: Comment,
    ) => {
        return withErrorHandling(async () => {
            const response = await axios.get<Comment>(
                route('comments.get', { comment_id: parentId }),
            );
            const parentComment = response.data;

            updateCacheWithParentAndReply(parentComment, replyComment);
            updateReplyPaginationState(replyComment);

            return parentComment;
        }, 'Error fetching parent comment').catch((err) =>
            console.error('Error fetching parent comment:', err),
        );
    };

    const updateCacheWithParentAndReply = (
        parentComment: Comment,
        replyComment: Comment,
    ) => {
        queryClient.setQueryData<CommentsInfiniteData | undefined>(
            commentsQueryKey,
            (oldData) =>
                !oldData
                    ? oldData
                    : (() => {
                          const lastPage = {
                              ...oldData.pages[oldData.pages.length - 1],
                          };
                          const parentExists = lastPage.data.some(
                              (c) => c.id === parentComment.id,
                          );

                          // Sử dụng toán tử ba ngôi thay vì if-else
                          lastPage.data = parentExists
                              ? [...lastPage.data, replyComment]
                              : [...lastPage.data, parentComment, replyComment];

                          return {
                              ...oldData,
                              pages: [...oldData.pages.slice(0, -1), lastPage],
                          };
                      })(),
        );
    };

    // ==================== Pusher Setup ====================
    useEffect(() => {
        if (showComments) {
            setupPusher();
        }
        return () => {
            cleanupPusher();
        };
    }, [chapter.id, currentUser.id, showComments]);

    const setupPusher = () => {
        // Khởi tạo Pusher
        pusherRef.current = new Pusher(
            import.meta.env.VITE_PUSHER_APP_KEY || 'a53de8327fa510a204f6',
            {
                cluster: 'ap1',
                authEndpoint: '/broadcasting/auth',
            },
        );

        // Setup channels và event handlers
        pusherRef.current && subscribeToChannels();
        pusherRef.current && setupEventHandlers();
    };

    const subscribeToChannels = () =>
        pusherRef.current && [
            pusherRef.current.subscribe(`private-chapter.${chapter.id}`),
            pusherRef.current.subscribe(`private-user.${currentUser.id}`),
        ];

    const setupEventHandlers = () => {
        if (!pusherRef.current) return;

        const chapterChannel = pusherRef.current.channel(
            `private-chapter.${chapter.id}`,
        );
        const userChannel = pusherRef.current.channel(
            `private-user.${currentUser.id}`,
        );

        // Bind events
        chapterChannel?.bind('comment.activity', handleChapterActivity);
        userChannel?.bind('comment.activity', handleUserActivity);
    };

    const handleChapterActivity = (data: {
        comment: Comment;
        action: string;
        timestamp: string;
    }) =>
        data.action === 'new'
            ? handleNewComment(data.comment)
            : data.action === 'reply' && handleNewReply(data.comment);

    const handleUserActivity = (data: {
        comment: Comment;
        action: string;
        timestamp: string;
    }) => data.action === 'reply' && handleNewReply(data.comment);

    const cleanupPusher = () =>
        pusherRef.current && [
            pusherRef.current.unsubscribe(`private-chapter.${chapter.id}`),
            pusherRef.current.unsubscribe(`private-user.${currentUser.id}`),
            pusherRef.current.disconnect(),
        ];

    // ==================== Return Values ====================

    return {
        showComments,
        comments,
        newComment,
        setNewComment,
        isSubmitting:
            addCommentMutation.isPending ||
            addReplyMutation.isPending ||
            isLoading,
        commentListRef,
        toggleComments,
        addComment,
        addReply,
        loadMoreComments,
        loadMoreReplies,
        commentPagination:
            commentPagination?.pages?.[commentPagination.pages.length - 1],
        replyPaginations,
        hasMoreComments: hasNextPage,
    };
};

export default useChapterComments;
