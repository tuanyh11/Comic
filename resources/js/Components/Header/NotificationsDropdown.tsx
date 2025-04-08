import useOutsideClick from '@/hooks/useOutsideClick';
import { Link } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

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

type NotificationsResponse = {
    notifications: Notification[];
};

interface NotificationsDropdownProps {
    userId: number | string;
}

const NotificationsDropdown = ({ userId }: NotificationsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Use the custom hook to handle outside clicks
    useOutsideClick(dropdownRef, () => {
        if (isOpen) setIsOpen(false);
    }, [buttonRef]);

    // Fetch notifications using React Query
    const { data, isLoading } = useQuery<NotificationsResponse>({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            const response = await fetch('/api/notifications');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<NotificationsResponse>;
        },
        enabled: isOpen, // Only fetch when dropdown is open
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    });

    const notifications = data?.notifications || [];
    const unreadCount = notifications.filter(
        (notification) => notification.read_at === null,
    ).length;

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/notifications/${id}/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }
            return id;
        },
        onSuccess: (id) => {
            // Update cache optimistically
            queryClient.setQueryData<NotificationsResponse>(
                ['notifications', userId],
                (oldData) => {
                    if (!oldData || !oldData.notifications)
                        return oldData as NotificationsResponse;

                    return {
                        ...oldData,
                        notifications: oldData.notifications.map(
                            (notification) =>
                                notification.id === id
                                    ? {
                                          ...notification,
                                          read_at: new Date().toISOString(),
                                      }
                                    : notification,
                        ),
                    };
                },
            );
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }
            return true;
        },
        onSuccess: () => {
            // Update cache optimistically
            queryClient.setQueryData<NotificationsResponse>(
                ['notifications', userId],
                (oldData) => {
                    if (!oldData || !oldData.notifications)
                        return oldData as NotificationsResponse;

                    return {
                        ...oldData,
                        notifications: oldData.notifications.map(
                            (notification) => ({
                                ...notification,
                                read_at:
                                    notification.read_at ||
                                    new Date().toISOString(),
                            }),
                        ),
                    };
                },
            );
        },
    });

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
                                onClick={() => markAllAsReadMutation.mutate()}
                                className="text-sm text-blue-600 hover:text-blue-800"
                                disabled={markAllAsReadMutation.isPending}
                            >
                                Đánh dấu tất cả là đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
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
                                                markAsReadMutation.mutate(
                                                    notification.id,
                                                );
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
