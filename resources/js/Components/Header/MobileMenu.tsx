import { Link } from '@inertiajs/react';
import { Bell, Wallet } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    user: any | null;
    wallet: {
        balance: number | string;
        currency: string;
    };
}

const MobileMenu = ({ isOpen, user, wallet }: MobileMenuProps) => {
    if (!isOpen) return null;

    return (
        <div className="border-t border-pink-300 bg-blue-50 px-4 py-2 md:hidden">
            <nav className="flex flex-col space-y-3">
                <a
                    href="#"
                    className="py-2 text-blue-700 transition-colors hover:text-pink-600"
                >
                    Khám phá
                </a>
                <a
                    href="#"
                    className="py-2 text-blue-700 transition-colors hover:text-pink-600"
                >
                    Cộng đồng
                </a>
                <a
                    href="#"
                    className="py-2 text-blue-700 transition-colors hover:text-pink-600"
                >
                    Viết
                </a>
                {user && (
                    <>
                        <Link
                            href={route('wallet.index')}
                            className="flex items-center py-2 text-blue-700 transition-colors hover:text-pink-600"
                        >
                            <Wallet className="mr-2 h-5 w-5" />
                            <span>
                                {wallet?.balance || '0.00'} {wallet.currency}
                            </span>
                        </Link>
                        {/* Add notifications menu item for mobile */}
                        <Link
                            href="/notifications"
                            className="flex items-center py-2 text-blue-700 transition-colors hover:text-pink-600"
                        >
                            <Bell className="mr-2 h-5 w-5" />
                            <span>Thông báo</span>
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
};

export default MobileMenu;
