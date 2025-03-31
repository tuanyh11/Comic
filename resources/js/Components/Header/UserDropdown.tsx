import useOutsideClick from '@/hooks/useOutsideClick';
import { Link, router } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Globe,
    HelpCircle,
    Inbox,
    LogOut,
    Settings,
    User,
    Wallet,
} from 'lucide-react';
import { useRef, useState } from 'react';
import Avatar from '../UI/Avatar';

interface UserDropdownProps {
    user: any;
}

const UserDropdown = ({ user }: UserDropdownProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Use the custom hook to handle outside clicks
    useOutsideClick(dropdownRef, () => {
        if (isDropdownOpen) setIsDropdownOpen(false);
    }, [buttonRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2"
            >
                <Avatar user={user} size="md" />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg">
                    <div className="py-1">
                        <Link
                            href={`/profile`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <User className="mr-3 h-5 w-5" /> Hồ sơ của tôi
                        </Link>
                        <a
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Inbox className="mr-3 h-5 w-5" /> Tin nhắn
                        </a>
                        <Link
                            href="/notifications"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-pink-600"
                        >
                            <Bell className="mr-3 h-5 w-5" /> Thông báo
                        </Link>
                        <a
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <BookOpen className="mr-3 h-5 w-5" /> Thư viện
                        </a>

                        {/* Show wallet in dropdown on mobile */}
                        <Link
                            href={route('wallet.index')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-pink-600 sm:hidden"
                        >
                            <Wallet className="mr-3 h-5 w-5" /> Ví của tôi
                        </Link>

                        <div className="my-1 border-t"></div>
                        <a
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Globe className="mr-3 h-5 w-5" /> Ngôn ngữ: Tiếng
                            Việt
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <HelpCircle className="mr-3 h-5 w-5" /> Trợ giúp
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Settings className="mr-3 h-5 w-5" /> Cài đặt
                        </a>
                        <div className="my-1 border-t"></div>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-5 w-5" /> Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
