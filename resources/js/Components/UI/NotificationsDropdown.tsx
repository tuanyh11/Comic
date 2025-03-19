import { Comment } from '@/types/custom';
import { formatDate } from '@/utils/formatDate';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Bell, Check, MessageCircle } from 'lucide-react';
import Pusher from 'pusher-js';
import { FC, useEffect, useState } from 'react';

interface NotificationsDropdownProps {
    userId: number;
}

const NotificationsDropdown: FC<NotificationsDropdownProps> = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial notifications
        fetchNotifications();

        // Set up Pusher subscription
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        });

        // Subscribe to the user's private channel
        const channel = pusher.subscribe(`private-user.${userId}`);

        // Listen for comment.activity events
        channel.bind(
            'comment.activity',
            (data: { timestamp: string; comment: Comment; action: string }) => {
                if (data.action === 'reply') {
                    // Add the new notification to the list
                    const newNotification = {
                        id: Date.now().toString(), // Temporary ID
                        type: 'App\\Notifications\\CommentReplyNotification',
                        read_at: null,
                        data: {
                            comment: data.comment,
                            action: data.action,
                            timestamp: data.timestamp,
                        },
                        created_at: data.timestamp,
                    };

                    setNotifications((prev) => [newNotification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    // Show browser notification if permitted
                    if (Notification && Notification.permission === 'granted') {
                        new Notification('Wattpad', {
                            body: `${data.comment.user.name} đã trả lời bình luận của bạn`,
                            icon: '/favicon.ico',
                        });
                    }
                }
            },
        );

        // Clean up
        return () => {
            pusher.unsubscribe(`private-user.${userId}`);
        };
    }, [userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/notifications');
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`/notifications/${id}/mark-as-read`);

            // Update local state
            setNotifications(
                notifications.map((notification) =>
                    notification.id === id
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification,
                ),
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-as-read');

            // Update local state
            setNotifications(
                notifications.map((notification) => ({
                    ...notification,
                    read_at: notification.read_at || new Date().toISOString(),
                })),
            );

            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center text-white transition-colors hover:text-blue-100"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b p-3">
                        <h3 className="font-medium">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center p-4">
                                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                                <span className="ml-2 text-sm text-gray-500">
                                    Đang tải...
                                </span>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y">
                                {notifications.map((notification) => {
                                    const isCommentReply =
                                        notification.type ===
                                        'App\\Notifications\\CommentReplyNotification';
                                    const data = notification.data;
                                    const comment = isCommentReply
                                        ? data.comment
                                        : null;
                                    const isRead =
                                        notification.read_at !== null;

                                    if (!isCommentReply) return null;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`relative p-3 ${isRead ? 'bg-white' : 'bg-blue-50'}`}
                                        >
                                            <div className="flex">
                                                <div className="mr-3 flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                                        <MessageCircle
                                                            size={20}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-800">
                                                        <span className="font-medium">
                                                            {comment?.user.name}
                                                        </span>{' '}
                                                        đã trả lời bình luận của
                                                        bạn
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {formatDate(
                                                            notification.created_at,
                                                        )}
                                                    </p>
                                                    <div className="mt-2 rounded-md bg-gray-100 p-2 text-xs text-gray-700">
                                                        {comment?.content?.substring(
                                                            0,
                                                            100,
                                                        )}
                                                        {comment?.content
                                                            ?.length > 100
                                                            ? '...'
                                                            : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex justify-between">
                                                <Link
                                                    href={`/comic/${comment?.comic_id}/chapter/${comment?.chapter_id}`}
                                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                >
                                                    Xem bình luận
                                                </Link>

                                                {!isRead && (
                                                    <button
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id,
                                                            )
                                                        }
                                                        className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Check className="mr-1 h-3 w-3" />
                                                        Đánh dấu đã đọc
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                <p>Bạn chưa có thông báo nào</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t p-2">
                        <Link
                            href="/notifications"
                            className="block rounded-md p-2 text-center text-sm text-blue-600 hover:bg-blue-50"
                        >
                            Xem tất cả thông báo
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
