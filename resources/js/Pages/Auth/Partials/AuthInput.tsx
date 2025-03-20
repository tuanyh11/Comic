import { AlertCircle } from 'lucide-react';
import React from 'react';

interface AuthInputProps {
    id: string;
    name: string;
    type: string;
    value: string;
    label?: string;
    required?: boolean;
    autoComplete?: string;
    placeholder?: string;
    isFocused?: boolean;
    icon?: React.ReactNode;
    className?: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
    id,
    name,
    type,
    value,
    label,
    required = false,
    autoComplete,
    placeholder,
    isFocused = false,
    icon,
    className = '',
    error,
    onChange,
}) => {
    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    autoComplete={autoComplete}
                    required={required}
                    placeholder={placeholder}
                    autoFocus={isFocused}
                    onChange={onChange}
                    className={`block w-full rounded-xl border border-gray-200 bg-white py-3 ${
                        icon ? 'pl-10' : 'pl-3'
                    } pr-3 text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
                />
            </div>
            {error && (
                <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default AuthInput;
