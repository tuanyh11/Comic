// hooks/comments/useRealTimeUpdates.ts
import { Chapter, Comment, User } from '@/types/custom';
import Pusher from 'pusher-js';
import { RefObject, useEffect } from 'react';

type RealTimeUpdateProps = {
    chapter: Chapter;
    currentUser: User;
    commentListRef: RefObject<HTMLDivElement>;
    handleNewComment: (comment: Comment) => void;
    handleNewReply: (reply: Comment) => void;
};

export const useRealTimeUpdates = ({
    chapter,
    currentUser,
    handleNewComment,
    handleNewReply,
}: RealTimeUpdateProps) => {
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
    }, [chapter.id, currentUser.id, handleNewComment, handleNewReply]);
};

export default useRealTimeUpdates;
