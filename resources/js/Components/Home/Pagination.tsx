// @/Components/Home/Pagination.tsx
import { PageProps } from '@/types';
import { Comic, LaravelPagination } from '@/types/custom';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

interface PaginationProps {
    pagination: Pick<
        LaravelPagination<Comic>,
        'current_page' | 'last_page' | 'next_page_url' | 'prev_page_url'
    >;
}

interface CustomPageProps extends PageProps {
    genreFilters: string;
    activeTab: string;
}

const Pagination: FC<PaginationProps> = ({ pagination }) => {
    const { genreFilters, activeTab } = usePage<CustomPageProps>().props;

    // Create query params for pagination links
    const createParams = (page: number) => {
        const params: Record<string, string | number> = { page };

        if (genreFilters) {
            params.genre = genreFilters;
        }

        if (activeTab) {
            params.tab = activeTab;
        }

        return params;
    };

    return (
        <div className="mt-12 flex items-center justify-center">
            {pagination.last_page > 1 && (
                <div className="flex items-center space-x-2">
                    <Link
                        href={
                            pagination.prev_page_url
                                ? route(
                                      'home',
                                      createParams(pagination.current_page - 1),
                                  )
                                : '#'
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            pagination.prev_page_url
                                ? 'bg-white text-blue-600 shadow hover:bg-blue-50'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400'
                        }`}
                        preserveScroll
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>

                    {[...Array(pagination.last_page)].map((_, index) => (
                        <Link
                            key={index}
                            href={route('home', createParams(index + 1))}
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                pagination.current_page === index + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-blue-600 shadow hover:bg-blue-50'
                            }`}
                            preserveScroll
                        >
                            {index + 1}
                        </Link>
                    ))}

                    <Link
                        href={
                            pagination.next_page_url
                                ? route(
                                      'home',
                                      createParams(pagination.current_page + 1),
                                  )
                                : '#'
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            pagination.next_page_url
                                ? 'bg-white text-blue-600 shadow hover:bg-blue-50'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400'
                        }`}
                        preserveScroll
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Pagination;
