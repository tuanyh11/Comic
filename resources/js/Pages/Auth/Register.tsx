// RegisterPage.tsx
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, BookOpen, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import AuthBanner from './Partials/AuthBanner';
import AuthButton from './Partials/AuthButton';
import AuthCard from './Partials/AuthCard';
import AuthDivider from './Partials/AuthDivider';
import AuthInput from './Partials/AuthInput';
import SocialLoginButton from './Partials/SocialLoginButton';

const Register = () => {
    const { errors, flash } = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false, // Thêm trường terms để lưu trạng thái checkbox
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post('/register', formData);
    };

    const handleGoogleSignup = () => {
        window.location.href = '/auth/google/redirect';
    };

    const bannerFeatures = [
        { text: 'Tạo và chia sẻ những câu chuyện của riêng bạn' },
        { text: 'Tương tác với cộng đồng độc giả và tác giả' },
        { text: 'Lưu và theo dõi những tác phẩm yêu thích' },
        { text: 'Nhận thông báo về các cập nhật và xu hướng mới' },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100">
            {/* Left Banner Section */}
            <AuthBanner
                icon={<BookOpen className="mr-3 h-10 w-10 text-yellow-200" />}
                title="Bắt đầu hành trình sáng tạo!"
                description="Tạo tài khoản để tham gia cộng đồng, chia sẻ ý tưởng và khám phá những câu chuyện tuyệt vời."
                features={bannerFeatures}
            />

            {/* Right Register Form Section */}
            <AuthCard
                title="Đăng ký"
                subtitle={
                    <>
                        Đã có tài khoản?{' '}
                        <a
                            href="/login"
                            className="font-medium text-blue-500 transition-colors duration-300 hover:text-blue-700"
                        >
                            Đăng nhập
                        </a>
                    </>
                }
                flash={flash}
            >
                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Họ tên */}
                        <AuthInput
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            label="Họ tên"
                            placeholder="Nhập họ và tên của bạn"
                            autoComplete="name"
                            required
                            icon={<User className="h-5 w-5 text-blue-400" />}
                            error={errors.name}
                            onChange={handleChange}
                        />

                        {/* Email */}
                        <AuthInput
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            label="Email"
                            placeholder="Nhập địa chỉ email của bạn"
                            autoComplete="email"
                            required
                            icon={<Mail className="h-5 w-5 text-blue-400" />}
                            error={errors.email}
                            onChange={handleChange}
                        />

                        {/* Mật khẩu */}
                        <AuthInput
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            label="Mật khẩu"
                            placeholder="Tạo mật khẩu mới"
                            autoComplete="new-password"
                            required
                            icon={<Lock className="h-5 w-5 text-blue-400" />}
                            error={errors.password}
                            onChange={handleChange}
                        />

                        {/* Xác nhận mật khẩu */}
                        <AuthInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            required
                            icon={<Lock className="h-5 w-5 text-blue-400" />}
                            error={errors.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Checkbox đồng ý điều khoản bảo mật */}
                    <div className="mt-4 flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-gray-700">
                                Tôi đồng ý với{' '}
                                <a
                                    href="/terms"
                                    className="font-medium text-blue-500 hover:text-blue-700"
                                >
                                    Điều khoản sử dụng
                                </a>{' '}
                                và{' '}
                                {/* <a
                                    href="/privacy"
                                    className="font-medium text-blue-500 hover:text-blue-700"
                                >
                                    Chính sách bảo mật
                                </a>{' '} */}
                                của website
                            </label>
                        </div>
                    </div>

                    {errors.terms && (
                        <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {errors.terms}
                        </div>
                    )}

                    <div className="mt-6">
                        <AuthButton>Đăng ký tài khoản</AuthButton>
                    </div>

                    {/* Divider */}
                    <AuthDivider text="Hoặc đăng ký với" />

                    {/* Social Register */}
                    <div>
                        <SocialLoginButton
                            provider="google"
                            onClick={handleGoogleSignup}
                        />
                    </div>

                    {/* Lưu ý bảo mật */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và
                        không bao giờ chia sẻ dữ liệu của bạn cho bên thứ ba mà
                        không có sự đồng ý.
                    </div>
                </form>
            </AuthCard>
        </div>
    );
};

export default Register;
