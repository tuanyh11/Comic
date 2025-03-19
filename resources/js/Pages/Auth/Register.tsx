// RegisterPage.tsx
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, BookOpen, Check, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';

const Register = () => {
    const { errors, flash } = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        // terms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/register', formData);
    };

    const handleGoogleSignup = () => {
        window.location.href = '/auth/google/redirect';
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100">
            {/* Left Banner Section */}
            <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 p-12 text-white lg:flex lg:w-1/2">
                {/* Decorative elements */}
                <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-yellow-300 opacity-60"></div>
                <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-pink-300 opacity-60"></div>
                <div className="absolute right-40 top-40 h-16 w-16 rounded-full bg-blue-300 opacity-60"></div>

                <div className="relative z-10 max-w-md">
                    <div className="mb-6 flex items-center">
                        <BookOpen className="mr-3 h-10 w-10 text-yellow-200" />
                        <h1 className="text-4xl font-bold text-white">
                            Bắt đầu hành trình sáng tạo!
                        </h1>
                    </div>
                    <p className="mb-10 text-xl leading-relaxed text-white">
                        Tạo tài khoản để tham gia cộng đồng, chia sẻ ý tưởng và
                        khám phá những câu chuyện tuyệt vời.
                    </p>
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full border border-white/40 bg-white/30 p-2">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white">
                                Tạo và chia sẻ những câu chuyện của riêng bạn
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full border border-white/40 bg-white/30 p-2">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white">
                                Tương tác với cộng đồng độc giả và tác giả
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full border border-white/40 bg-white/30 p-2">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white">
                                Lưu và theo dõi những tác phẩm yêu thích
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 rounded-full border border-white/40 bg-white/30 p-2">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white">
                                Nhận thông báo về các cập nhật và xu hướng mới
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Register Form Section */}
            <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
                {/* Decorative elements */}
                <div className="absolute right-20 top-20 h-16 w-16 rounded-full bg-blue-300 opacity-40"></div>
                <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-pink-300 opacity-30"></div>

                <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        {/* <img
                            className="mx-auto h-16 w-auto"
                            src="/api/placeholder/160/56"
                            alt="Wattpad logo"
                        /> */}
                        <h2 className="mt-5 text-3xl font-bold text-gray-800">
                            Đăng ký
                        </h2>
                        <p className="mt-2 text-center text-gray-600">
                            Đã có tài khoản?{' '}
                            <a
                                href="/login"
                                className="font-medium text-blue-500 transition-colors duration-300 hover:text-blue-700"
                            >
                                Đăng nhập
                            </a>
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash && flash.message && (
                        <div className="mb-6 flex items-start rounded-lg border-l-4 border-green-400 bg-green-100 p-4">
                            <Check className="mr-3 mt-0.5 h-5 w-5 text-green-500" />
                            <div className="text-sm text-green-700">
                                {flash.message}
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Họ tên */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Họ tên
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập họ và tên của bạn"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.name && (
                                    <div className="mt-1 flex items-center text-sm text-red-500">
                                        <AlertCircle className="mr-1 h-4 w-4" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập địa chỉ email của bạn"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.email && (
                                    <div className="mt-1 flex items-center text-sm text-red-500">
                                        <AlertCircle className="mr-1 h-4 w-4" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Tạo mật khẩu mới"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.password && (
                                    <div className="mt-1 flex items-center text-sm text-red-500">
                                        <AlertCircle className="mr-1 h-4 w-4" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập lại mật khẩu"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <div className="mt-1 flex items-center text-sm text-red-500">
                                        <AlertCircle className="mr-1 h-4 w-4" />
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Điều khoản dịch vụ */}
                        {/* <div className="mt-6 flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="terms"
                                    className="text-gray-600"
                                >
                                    Tôi đồng ý với{' '}
                                    <a
                                        href="#"
                                        className="text-blue-500 transition-colors hover:text-blue-700"
                                    >
                                        Điều khoản dịch vụ
                                    </a>{' '}
                                    và{' '}
                                    <a
                                        href="#"
                                        className="text-blue-500 transition-colors hover:text-blue-700"
                                    >
                                        Chính sách bảo mật
                                    </a>
                                </label>
                            </div>
                        </div> */}
                        {errors.terms && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                {errors.terms}
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-pink-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Đăng ký tài khoản
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500">
                                    Hoặc đăng ký với
                                </span>
                            </div>
                        </div>

                        {/* Social Register */}
                        <div>
                            <button
                                onClick={handleGoogleSignup}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path
                                        d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>

                        {/* Lưu ý bảo mật */}
                        <div className="mt-6 text-center text-xs text-gray-500">
                            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn
                            và không bao giờ chia sẻ dữ liệu của bạn cho bên thứ
                            ba mà không có sự đồng ý.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
