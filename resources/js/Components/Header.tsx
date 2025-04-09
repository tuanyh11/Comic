import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

// Import components
import AuthButtons from './Header/AuthButtons';
import MobileMenu from './Header/MobileMenu';
import SearchBar from './Header/SearchBar';
import UserDropdown from './Header/UserDropdown';
import WalletDropdown from './Header/WalletDropdown';
import NotificationsDropdown from './UI/NotificationsDropdown';

const Header = () => {
    const { auth, wallet } = usePage().props;
    const user = auth.user;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Request browser notification permission on component mount
    useEffect(() => {
        if (
            Notification &&
            Notification.permission !== 'granted' &&
            Notification.permission !== 'denied'
        ) {
            Notification.requestPermission();
        }
    }, []);

    return (
        <header
            id="header"
            className="sticky top-0 z-20 bg-gradient-to-r from-blue-500 to-pink-500 shadow-md"
        >
            {/* Desktop Header */}
            <div className="flex items-center justify-between p-4 md:px-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/comic"
                        className="text-xl font-bold text-white md:text-2xl"
                    >
                        <img
                            className="w-40"
                            src={`/storage/images/logo.png`}
                            alt=""
                        />
                    </Link>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Search Component */}
                    <SearchBar
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                        isMobile={true}
                    />

                    {/* Search icon for mobile */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-white hover:text-blue-100 md:hidden"
                    >
                        <FaSearch className="h-5 w-5" />
                    </button>

                    {user ? (
                        <>
                            {/* Wallet Component */}
                            <WalletDropdown wallet={wallet} />

                            {/* Notifications Component */}
                            <div className="hidden sm:block">
                                <NotificationsDropdown userId={user.id} />
                            </div>

                            {/* User Menu Component */}
                            <UserDropdown user={user} />

                            {/* Mobile menu button */}
                            <button
                                className="ml-2 text-white md:hidden"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Authentication Buttons Component */}
                            <AuthButtons />

                            {/* Mobile menu button */}
                            <button
                                className="ml-2 text-white md:hidden"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Component */}
            <MobileMenu isOpen={isMobileMenuOpen} user={user} wallet={wallet} />
        </header>
    );
};

export default Header;
