import { Link } from '@inertiajs/react';
import { Play } from 'lucide-react';
import React from 'react';

const ActionButtons: React.FC = () => {
    return (
        <div className="mb-12 flex flex-wrap gap-4">
            <Link
                href="/comic"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-600 hover:to-pink-600 hover:shadow-xl"
            >
                <Play className="h-5 w-5" />
                Đọc ngay
            </Link>
        </div>
    );
};

export default ActionButtons;
