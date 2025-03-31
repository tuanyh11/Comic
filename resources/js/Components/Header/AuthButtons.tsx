import { Link } from '@inertiajs/react';

const AuthButtons = () => {
    return (
        <>
            <Link
                href="/login"
                className="rounded-full border border-white bg-transparent px-3 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-blue-600 md:px-4 md:py-2 md:text-base"
            >
                Đăng nhập
            </Link>
            <Link
                href="/register"
                className="rounded-full bg-white px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 md:px-4 md:py-2 md:text-base"
            >
                Đăng ký
            </Link>
        </>
    );
};

export default AuthButtons;
