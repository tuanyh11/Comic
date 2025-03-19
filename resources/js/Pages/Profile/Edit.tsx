// ProfileForm.jsx
import { useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Camera,
    CheckCircle,
    Eye,
    EyeOff,
    Home,
    Lock,
    Mail,
    Save,
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
            className={`flex items-center border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                tab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
        >
            <Icon className="mr-2 h-4 w-4" />
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

    return (
        <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-8 sm:px-6 lg:px-8">
            {/* Home Button */}
            <div className="fixed left-4 top-4 z-10">
                <button
                    onClick={navigateToHome}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-md transition-colors duration-200 hover:bg-blue-50"
                >
                    <Home className="h-5 w-5" />
                    Quay về trang chủ
                </button>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Hồ Sơ Người Dùng
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Quản lý thông tin cá nhân và bảo mật của bạn
                </p>
            </div>

            {notification.show && (
                <div
                    className={`fixed right-4 top-4 z-50 flex translate-x-0 transform items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all duration-500 ease-in-out ${
                        notification.type === 'success'
                            ? 'border-l-4 border-green-500 bg-green-50 text-green-800'
                            : 'border-l-4 border-red-500 bg-red-50 text-red-800'
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
                        className="ml-4 rounded-full p-1 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    {/* Profile header with avatar */}
                    <div className="flex flex-col items-center bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
                        <div className="group relative">
                            <div className="h-32 w-32 overflow-hidden rounded-full bg-white shadow-md ring-4 ring-white">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : user?.avatar ? (
                                    <img
                                        src={user.avatar.url}
                                        alt="Current avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                                        <User size={64} />
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50"></div>
                                <div className="z-10 flex gap-2">
                                    <label
                                        htmlFor="avatar"
                                        className="cursor-pointer rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
                                    >
                                        <Camera
                                            size={20}
                                            className="text-blue-600"
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
                                            className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
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
                        <h3 className="mt-4 text-xl font-bold text-white">
                            {data.name || 'Tên người dùng'}
                        </h3>
                        <p className="text-blue-100">
                            {data.email || 'email@example.com'}
                        </p>
                    </div>

                    {/* Navigation tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <TabButton
                                id="info"
                                label="Thông tin cá nhân"
                                icon={User}
                            />
                            <TabButton
                                id="security"
                                label="Bảo mật"
                                icon={Lock}
                            />
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="px-6 py-6">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {tab === 'info' ? (
                                <>
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Họ và tên
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Nguyễn Văn A"
                                                value={data.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="example@email.com"
                                                value={data.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Password with strength meter */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                id="password"
                                                className="block w-full rounded-lg border-gray-300 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Để trống nếu không thay đổi"
                                                value={data.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}

                                        {data.password && (
                                            <>
                                                <div className="mt-2">
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 ease-in-out`}
                                                            style={{
                                                                width: `${passwordStrength()}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        Độ mạnh:{' '}
                                                        {passwordStrength() <=
                                                        25
                                                            ? 'Yếu'
                                                            : passwordStrength() <=
                                                                50
                                                              ? 'Trung bình'
                                                              : passwordStrength() <=
                                                                  75
                                                                ? 'Khá'
                                                                : 'Mạnh'}
                                                    </p>
                                                </div>

                                                <div className="mt-3 rounded-lg bg-gray-50 p-4 text-xs">
                                                    <p className="mb-2 font-medium text-gray-700">
                                                        Yêu cầu mật khẩu:
                                                    </p>
                                                    <ul className="space-y-2">
                                                        <li className="flex items-center">
                                                            <span
                                                                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${data.password.length >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {data.password
                                                                    .length >=
                                                                8 ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </span>
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
                                                        </li>
                                                        <li className="flex items-center">
                                                            <span
                                                                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${/[A-Z]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[A-Z]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </span>
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
                                                        </li>
                                                        <li className="flex items-center">
                                                            <span
                                                                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${/[0-9]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[0-9]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </span>
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
                                                        </li>
                                                        <li className="flex items-center">
                                                            <span
                                                                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${/[!@#$%^&*]/.test(data.password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                            >
                                                                {/[!@#$%^&*]/.test(
                                                                    data.password,
                                                                ) ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </span>
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
                                                                (!@#$%^&*)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Password Confirmation */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                className={`block w-full rounded-lg border-gray-300 pl-10 pr-10 shadow-sm focus:ring-blue-500 sm:text-sm ${
                                                    data.password &&
                                                    data.password_confirmation &&
                                                    data.password !==
                                                        data.password_confirmation
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'focus:border-blue-500'
                                                }`}
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
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {data.password &&
                                            data.password_confirmation &&
                                            data.password !==
                                                data.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    Mật khẩu không khớp
                                                </p>
                                            )}
                                    </div>
                                </>
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
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                                            <Save size={18} />
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
