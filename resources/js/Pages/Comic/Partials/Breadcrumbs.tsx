import { Comic } from '@/types/custom';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { FC } from 'react';

interface BreadcrumbsProps {
    comic: Comic;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ comic }) => {
    return (
        <div className="mb-6 flex items-center text-sm text-gray-600">
            <Link
                href="/comic"
                className="flex items-center transition-colors hover:text-indigo-600"
            >
                <Home className="mr-1 h-4 w-4" />
                Trang chủ
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <Link
                href="/comic"
                className="transition-colors hover:text-indigo-600"
            >
                Truyện
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="max-w-[200px] truncate font-medium text-indigo-600">
                {comic.title}
            </span>
        </div>
    );
};

export default Breadcrumbs;
