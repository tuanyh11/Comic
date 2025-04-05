// ProfileForm.jsx
import { useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Camera,
    CheckCircle,
    ChevronRight,
    Eye,
    EyeOff,
    Home,
    Lock,
    Mail,
    Save,
    Shield,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ProfileForm = () => {
    const { user } = usePage().props.auth;
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: '',
    });
    const [tab, setTab] = useState('info'); // 'info' or 'security'

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        avatar: null,
        _method: 'PATCH',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setNotification({
                    show: true,
                    message: 'Avatar không được vượt quá 5MB',
                    type: 'error',
                });
                return;
            }
            setPhotoPreview(URL.createObjectURL(file));
            setData('avatar', file);
        }
    };

    const removeAvatar = () => {
        setPhotoPreview(null);
        setData('avatar', null);
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            onSuccess: () => {
                setNotification({
                    show: true,
                    message: 'Cập nhật thông tin thành công!',
                    type: 'success',
                });
                reset('password', 'password_confirmation');
            },
            onError: () => {
                setNotification({
                    show: true,
                    message: 'Đã xảy ra lỗi khi cập nhật thông tin!',
                    type: 'error',
                });
            },
        });
    };

    const navigateToHome = () => {
        window.location.href = route('home');
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
                tab === id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon
                className={`h-4 w-4 ${tab === id ? 'text-white' : 'text-gray-500'}`}
            />
            {label}
        </button>
    );

    const passwordStrength = () => {
        if (!data.password) return 0;
        let score = 0;
        if (data.password.length >= 8) score += 25;
        if (/[A-Z]/.test(data.password)) score += 25;
        if (/[0-9]/.test(data.password)) score += 25;
        if (/[!@#$%^&*]/.test(data.password)) score += 25;
        return score;
    };

    const getPasswordStrengthColor = () => {
        const score = passwordStrength();
        if (score <= 25) return 'bg-red-500';
        if (score <= 50) return 'bg-orange-500';
        if (score <= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        const score = passwordStrength();
        if (score <= 25) return 'Yếu';
        if (score <= 50) return 'Trung bình';
        if (score <= 75) return 'Khá';
        return 'Mạnh';
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
            {/* Home Button */}
            <div className="fixed left-6 top-6 z-10">
                <button
                    onClick={navigateToHome}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 shadow-lg transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                >
                    <Home className="h-5 w-5" />
                    <span>Quay về trang chủ</span>
                </button>
            </div>

            <div className="mx-auto w-full max-w-4xl">
                <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-4xl font-extrabold text-transparent">
                    Hồ Sơ Người Dùng
                </h2>
                <p className="mt-3 text-center text-lg text-gray-600">
                    Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
                </p>
            </div>

            {/* Notification */}
            {notification.show && (
                <div
                    className={`fixed right-6 top-6 z-50 flex translate-x-0 transform items-center gap-3 rounded-xl px-6 py-4 shadow-xl transition-all duration-500 ease-in-out ${
                        notification.type === 'success'
                            ? 'border-l-4 border-green-500 bg-white text-green-800'
                            : 'border-l-4 border-red-500 bg-white text-red-800'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() =>
                            setNotification({ ...notification, show: false })
                        }
                        className="ml-2 rounded-full p-1 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="mx-auto mt-10 w-full max-w-4xl">
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    {/* Profile header with avatar */}
                    <div className="flex flex-col items-center bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10">
                        <div className="group relative">
                            <div className="relative h-36 w-36 overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : user?.avatar ? (
                                    <img
                                        src={`${user?.avatar}`}
                                        alt="Current avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-indigo-50 text-indigo-300">
                                        <User size={80} />
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50"></div>
                                <div className="z-10 flex gap-3">
                                    <label
                                        htmlFor="avatar"
                                        className="cursor-pointer rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-indigo-50"
                                    >
                                        <Camera
                                            size={20}
                                            className="text-indigo-600"
                                        />
                                        <input
                                            id="avatar"
                                            name="avatar"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    {(photoPreview || user?.avatar) && (
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-red-50"
                                        >
                                            <X
                                                size={20}
                                                className="text-red-600"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <h3 className="mt-5 text-2xl font-bold text-white">
                            {data.name || 'Tên người dùng'}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-indigo-100">
                            <Mail className="h-4 w-4" />
                            {data.email || 'email@example.com'}
                        </p>
                    </div>

                    {/* Content area */}
                    <div className="px-8 py-8">
                        {/* Navigation tabs */}
                        <div className="mb-8 flex justify-center gap-4">
                            <TabButton
                                id="info"
                                label="Thông tin cá nhân"
                                icon={User}
                            />
                            <TabButton
                                id="security"
                                label="Bảo mật"
                                icon={Shield}
                            />
                        </div>

                        {/* Form content */}
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {tab === 'info' ? (
                                <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-inner">
                                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                        <User className="h-5 w-5 text-indigo-600" />
                                        Thông tin cá nhân
                                    </h3>

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Họ và tên
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <User className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="block w-full rounded-xl border-0 bg-white pl-12 shadow-md ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm"
                                                placeholder="Nguyễn Văn A"
                                                value={data.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-sm font-medium text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <Mail className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="block w-full rounded-xl border-0 bg-white pl-12 shadow-md ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm"
                                                placeholder="example@email.com"
                                                value={data.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm font-medium text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 rounded-xl bg-gray-50 p-6 shadow-inner">
                                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                        <Shield className="h-5 w-5 text-indigo-600" />
                                        Cập nhật mật khẩu
                                    </h3>

                                    {/* Password with strength meter */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <Lock className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                id="password"
                                                className="block w-full rounded-xl border-0 bg-white pl-12 pr-12 shadow-md ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm"
                                                placeholder="Để trống nếu không thay đổi"
                                                value={data.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-4"
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm font-medium text-red-600">
                                                {errors.password}
                                            </p>
                                        )}

                                        {data.password && (
                                            <>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="w-full max-w-xs">
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                            <div
                                                                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 ease-in-out`}
                                                                style={{
                                                                    width: `${passwordStrength()}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <p className="ml-3 text-sm font-medium">
                                                        <span className="text-gray-600">
                                                            Độ mạnh:
                                                        </span>{' '}
                                                        <span
                                                            className={
                                                                passwordStrength() <=
                                                                25
                                                                    ? 'text-red-600'
                                                                    : passwordStrength() <=
                                                                        50
                                                                      ? 'text-orange-600'
                                                                      : passwordStrength() <=
                                                                          75
                                                                        ? 'text-yellow-600'
                                                                        : 'text-green-600'
                                                            }
                                                        >
                                                            {getPasswordStrengthText()}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="mt-5 rounded-xl bg-indigo-50 p-5 shadow-sm">
                                                    <p className="mb-3 font-medium text-indigo-700">
                                                        Yêu cầu mật khẩu:
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                                                            <div
                                                                className={`flex h-6 w-6 items-center justify-center rounded-full ${data.password.length >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {data.password
                                                                    .length >=
                                                                8 ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={
                                                                    data
                                                                        .password
                                                                        .length >=
                                                                    8
                                                                        ? 'text-green-700'
                                                                        : 'text-gray-600'
                                                                }
                                                            >
                                                                Ít nhất 8 ký tự
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                                                            <div
                                                                className={`flex h-6 w-6 items-center justify-center rounded-full ${/[A-Z]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[A-Z]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={
                                                                    /[A-Z]/.test(
                                                                        data.password,
                                                                    )
                                                                        ? 'text-green-700'
                                                                        : 'text-gray-600'
                                                                }
                                                            >
                                                                Ít nhất 1 chữ in
                                                                hoa
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                                                            <div
                                                                className={`flex h-6 w-6 items-center justify-center rounded-full ${/[0-9]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[0-9]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={
                                                                    /[0-9]/.test(
                                                                        data.password,
                                                                    )
                                                                        ? 'text-green-700'
                                                                        : 'text-gray-600'
                                                                }
                                                            >
                                                                Ít nhất 1 chữ số
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                                                            <div
                                                                className={`flex h-6 w-6 items-center justify-center rounded-full ${/[!@#$%^&*]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[!@#$%^&*]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={
                                                                    /[!@#$%^&*]/.test(
                                                                        data.password,
                                                                    )
                                                                        ? 'text-green-700'
                                                                        : 'text-gray-600'
                                                                }
                                                            >
                                                                Ít nhất 1 ký tự
                                                                đặc biệt
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Password Confirmation */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <Lock className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                className={`block w-full rounded-xl border-0 bg-white pl-12 pr-12 shadow-md ring-1 ${
                                                    data.password &&
                                                    data.password_confirmation &&
                                                    data.password !==
                                                        data.password_confirmation
                                                        ? 'ring-red-300 focus:ring-red-500'
                                                        : 'ring-gray-200 focus:ring-indigo-500'
                                                } focus:ring-2 focus:ring-offset-0 sm:text-sm`}
                                                placeholder="Xác nhận mật khẩu mới"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                disabled={!data.password}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-4"
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                                                )}
                                            </button>
                                        </div>
                                        {data.password &&
                                            data.password_confirmation &&
                                            data.password !==
                                                data.password_confirmation && (
                                                <p className="mt-2 text-sm font-medium text-red-600">
                                                    Mật khẩu không khớp
                                                </p>
                                            )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (data.password &&
                                            data.password !==
                                                data.password_confirmation)
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-purple-600"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Lưu thông tin
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
