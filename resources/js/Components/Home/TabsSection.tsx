// @/Components/Home/TabsSection.tsx
import { Star, TrendingUp } from 'lucide-react';
import { FC } from 'react';

interface TabsSectionProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsSection: FC<TabsSectionProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="mb-8 flex border-b">
            <button
                onClick={() => setActiveTab('for-you')}
                className={`flex items-center space-x-2 px-4 py-2 ${
                    activeTab === 'for-you'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600'
                }`}
            >
                <Star className="h-5 w-5" />
                <span>Dành cho bạn</span>
            </button>
            <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center space-x-2 px-4 py-2 ${
                    activeTab === 'trending'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600'
                }`}
            >
                <TrendingUp className="h-5 w-5" />
                <span>Xu hướng</span>
            </button>
        </div>
    );
};

export default TabsSection;
