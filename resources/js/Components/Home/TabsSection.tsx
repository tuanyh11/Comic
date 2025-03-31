// @/Components/Home/TabsSection.tsx
import { Link } from '@inertiajs/react';
import { Flame, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { FC } from 'react';

interface TabsSectionProps {
    activeTab: string;
}

const TabsSection: FC<TabsSectionProps> = ({ activeTab }) => {
    const tabs = [
        {
            id: 'for-you',
            label: 'Dành cho bạn',
            icon: <Sparkles className="h-5 w-5" />,
            color: 'from-indigo-600 to-purple-600',
        },
        {
            id: 'trending',
            label: 'Xu hướng',
            icon: <TrendingUp className="h-5 w-5" />,
            color: 'from-blue-600 to-cyan-600',
        },
        {
            id: 'hot',
            label: 'Truyện hot',
            icon: <Flame className="h-5 w-5" />,
            color: 'from-orange-600 to-red-600',
        },
        {
            id: 'favorite',
            label: 'Yêu thích',
            icon: <Heart className="h-5 w-5" />,
            color: 'from-pink-600 to-rose-600',
        },
    ];

    return (
        <div className="mb-10 overflow-hidden rounded-2xl bg-white p-2 shadow-md">
            <div className="flex flex-wrap">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={route('home', { tab: tab.id })}
                        className={`relative flex items-center gap-2 rounded-xl px-5 py-3 text-base font-medium transition-all duration-300 md:flex-1 md:justify-center ${
                            activeTab === tab.id
                                ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        preserveScroll
                    >
                        {activeTab === tab.id && (
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-20 blur-xl"></span>
                        )}
                        {tab.icon}
                        <span>{tab.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TabsSection;
