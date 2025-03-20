import React from 'react';

interface AuthButtonProps {
    type?: 'submit' | 'button' | 'reset';
    className?: string;
    processing?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
    type = 'submit',
    className = '',
    processing = false,
    children,
    onClick,
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={processing || disabled}
            className={`group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-pink-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                processing || disabled ? 'cursor-not-allowed opacity-70' : ''
            } ${className}`}
        >
            {processing ? 'Đang xử lý...' : children}
        </button>
    );
};

export default AuthButton;
