import { Check } from 'lucide-react';
import React from 'react';

interface FlashMessage {
    message: string;
}

interface AuthCardProps {
    title: string;
    subtitle?: React.ReactNode;
    flash?: FlashMessage;
    children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
    title,
    subtitle,
    flash,
    children,
}) => {
    return (
        <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
            {/* Decorative elements */}
            <div className="absolute right-20 top-20 h-16 w-16 rounded-full bg-blue-300 opacity-40"></div>
            <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-pink-300 opacity-30"></div>

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h2 className="mt-5 text-3xl font-bold text-gray-800">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-center text-gray-600">
                            {subtitle}
                        </p>
                    )}
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

                {children}
            </div>
        </div>
    );
};

export default AuthCard;
