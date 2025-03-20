import Avatar from '@/Components/UI/Avatar';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

const Navbar: React.FC = () => {
    const user = usePage().props.auth.user;
    return (
        <div className="sticky left-0 right-0 top-0 z-[99999]">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold text-white">
                        <img
                            className="w-40"
                            src={`/storage/images/logo.png`}
                            alt=""
                        />
                    </h2>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <Link href={'/profile'}>
                            <Avatar user={user} size="md" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-pink-600"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
