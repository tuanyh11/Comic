import React from 'react';

interface AuthDividerProps {
    text: string;
}

const AuthDivider: React.FC<AuthDividerProps> = ({ text }) => {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">{text}</span>
            </div>
        </div>
    );
};

export default AuthDivider;
