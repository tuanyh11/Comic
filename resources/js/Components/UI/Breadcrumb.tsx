import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { FC } from 'react';

interface BreadcrumbProps {
    items: {
        label: string;
        href?: string;
    }[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className="relative z-20 flex items-center gap-1 rounded bg-black/50 p-2 text-sm font-medium text-white backdrop-blur-sm">
            <Link
                href="/comic"
                className="flex items-center transition-colors hover:text-blue-300"
            >
                <Home className="mr-1 h-4 w-4" />
                Trang chủ
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="transition-colors hover:text-blue-300"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-300">{item.label}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Breadcrumb;
