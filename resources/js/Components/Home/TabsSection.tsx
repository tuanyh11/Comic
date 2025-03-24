// @/Components/Home/TabsSection.tsx
import { Link } from '@inertiajs/react';
import { Crown, FireExtinguisher, Heart, Star, TrendingUp } from 'lucide-react';
import { FC } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface TabsSectionProps {
    activeTab: string;
}

const TabsSection: FC<TabsSectionProps> = ({ activeTab }) => {
    const tabs = [
        {
            id: 'for-you',
            label: 'Dành cho bạn',
            icon: <Star className="h-5 w-5" />,
        },
        {
            id: 'trending',
            label: 'Xu hướng',
            icon: <TrendingUp className="h-5 w-5" />,
        },
        {
            id: 'hot',
            label: 'Truyện hot',
            icon: <Crown className="h-5 w-5" />,
        },
        {
            id: 'favorite',
            label: 'Yêu thích',
            icon: <Heart className="h-5 w-5" />,
        },
    ];

    return (
        <div className="mb-8 flex flex-wrap border-b">
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={route('home', { tab: tab.id })}
                    className={`flex items-center space-x-2 px-4 py-2 ${
                        activeTab === tab.id
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    preserveScroll
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default TabsSection;
