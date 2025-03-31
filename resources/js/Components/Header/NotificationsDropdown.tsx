import useOutsideClick from '@/hooks/useOutsideClick';
import { Link } from '@inertiajs/react';
import { Bell, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Notification = {
    id: string;
    type: string;
    data: {
        message: string;
        title?: string;
    };
    read_at: string | null;
    created_at: string;
};

interface NotificationsDropdownProps {
    userId: number | string;
}

const NotificationsDropdown = ({ userId }: NotificationsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Use the custom hook to handle outside clicks
    useOutsideClick(dropdownRef, () => {
        if (isOpen) setIsOpen(false);
    }, [buttonRef]);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (isOpen && notifications.length === 0) {
                try {
                    setLoading(true);
                    const response = await fetch('/notifications');
                    const data = await response.json();

                    if (data && data.notifications) {
                        setNotifications(data.notifications);

                        // Count unread notifications
                        const unread = data.notifications.filter(
                            (notification: Notification) =>
                                notification.read_at === null,
                        ).length;

                        setUnreadCount(unread);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [isOpen, notifications.length]);

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Update local state
            setNotifications(
                notifications.map((notification) =>
                    notification.id === id
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification,
                ),
            );

            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

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

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 30) return `${diffDays} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative">
            {/* Notification Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-white hover:bg-white/10"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg"
                >
                    <div className="flex items-center justify-between border-b p-3">
                        <h3 className="font-semibold">Thông báo</h3>
                        {notifications.length > 0 && unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Đánh dấu tất cả là đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <p className="mt-2 text-sm text-gray-500">
                                    Đang tải thông báo...
                                </p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex p-3 transition-colors hover:bg-blue-50 ${
                                            !notification.read_at
                                                ? 'bg-blue-50'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            if (!notification.read_at) {
                                                markAsRead(notification.id);
                                            }
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="mb-1 text-sm font-medium">
                                                {notification.data.title ||
                                                    'Thông báo mới'}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {notification.data.message}
                                            </p>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {formatDate(
                                                    notification.created_at,
                                                )}
                                            </div>
                                        </div>
                                        {!notification.read_at && (
                                            <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <p>Bạn chưa có thông báo nào</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t p-2">
                        <Link
                            href="/notifications"
                            className="block rounded-md p-2 text-center text-sm text-blue-600 transition-colors hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
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
