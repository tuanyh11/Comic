import { Check } from 'lucide-react';
import React from 'react';

interface BannerFeature {
    text: string;
}

interface AuthBannerProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: BannerFeature[];
}

const AuthBanner: React.FC<AuthBannerProps> = ({
    icon,
    title,
    description,
    features,
}) => {
    return (
        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 p-12 text-white lg:flex lg:w-1/2">
            {/* Decorative elements */}
            <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-yellow-300 opacity-60"></div>
            <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-pink-300 opacity-60"></div>
            <div className="absolute right-40 top-40 h-16 w-16 rounded-full bg-blue-300 opacity-60"></div>

            <div className="relative z-10 max-w-md">
                <div className="mb-6 flex items-center">
                    {icon}
                    <h1 className="text-4xl font-bold text-white">{title}</h1>
                </div>
                <p className="mb-10 text-xl leading-relaxed text-white">
                    {description}
                </p>
                <div className="mt-12 space-y-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                            <div className="mr-4 rounded-full border border-white/40 bg-white/30 p-2">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-white">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthBanner;
