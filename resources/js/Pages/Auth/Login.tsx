// LoginPage.tsx
import { useForm, usePage } from '@inertiajs/react';
import { Lock, Mail, Sun } from 'lucide-react';
import AuthBanner from './Partials/AuthBanner';
import AuthButton from './Partials/AuthButton';
import AuthCard from './Partials/AuthCard';
import AuthDivider from './Partials/AuthDivider';
import AuthInput from './Partials/AuthInput';
import SocialLoginButton from './Partials/SocialLoginButton';

const Login = () => {
    const { errors, flash } = usePage().props;

    // Using Inertia's useForm instead of React's useState
    const { data, setData, post, processing } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setData(
            name as keyof typeof data,
            type === 'checkbox' ? checked : value,
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/login');
    };

    const handleGoogleLogin = () => {
        window.location.href = 'auth/google/redirect';
    };

    const bannerFeatures = [
        { text: 'Hàng ngàn câu chuyện thú vị đang chờ đón bạn' },
        { text: 'Cập nhật liên tục những nội dung mới nhất' },
        { text: 'Chia sẻ và kết nối với cộng đồng độc giả' },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100">
            {/* Left Banner Section */}
            <AuthBanner
                icon={<Sun className="mr-3 h-10 w-10 text-yellow-200" />}
                title="Tỏa sáng cùng chúng tôi!"
                description="Tham gia cộng đồng của chúng tôi để khám phá những câu chuyện tuyệt vời và chia sẻ ý tưởng sáng tạo của bạn."
                features={bannerFeatures}
            />

            {/* Right Login Form Section */}
            <AuthCard
                title="Đăng nhập"
                subtitle={
                    <>
                        Hoặc{' '}
                        <a
                            href="/register"
                            className="font-medium text-blue-500 transition-colors duration-300 hover:text-blue-700"
                        >
                            đăng ký tài khoản mới
                        </a>
                    </>
                }
                flash={flash}
            >
                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <AuthInput
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            label="Email"
                            placeholder="Nhập địa chỉ email của bạn"
                            autoComplete="email"
                            required
                            icon={<Mail className="h-5 w-5 text-blue-400" />}
                            error={errors.email}
                            onChange={handleChange}
                        />

                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mật khẩu
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-medium text-blue-500 transition-colors duration-300 hover:text-blue-700"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <AuthInput
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                placeholder="Nhập mật khẩu của bạn"
                                autoComplete="current-password"
                                required
                                icon={
                                    <Lock className="h-5 w-5 text-blue-400" />
                                }
                                error={errors.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                            checked={data.remember}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Lưu thông tin đăng nhập
                        </label>
                    </div>

                    <div>
                        <AuthButton processing={processing}>
                            Đăng nhập
                        </AuthButton>
                    </div>

                    {/* Divider */}
                    <AuthDivider text="Hoặc đăng nhập với" />

                    {/* Social Login */}
                    <div>
                        <SocialLoginButton
                            provider="google"
                            onClick={handleGoogleLogin}
                        />
                    </div>

                    {/* Terms */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        Bằng cách đăng nhập, bạn đồng ý với{' '}
                        <a
                            href="#"
                            className="text-blue-500 transition-colors duration-300 hover:text-blue-700"
                        >
                            Điều khoản dịch vụ
                        </a>{' '}
                        và{' '}
                        <a
                            href="#"
                            className="text-blue-500 transition-colors duration-300 hover:text-blue-700"
                        >
                            Chính sách bảo mật
                        </a>{' '}
                        của chúng tôi.
                    </div>
                </form>
            </AuthCard>
        </div>
    );
};

export default Login;
