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

    // Generate pagination items with consideration for large page counts
    const generatePaginationItems = () => {
        const items = [];
        const currentPage = pagination.current_page;
        const lastPage = pagination.last_page;

        // Always show first page
        items.push(1);

        // For small number of pages, show all
        if (lastPage <= 7) {
            for (let i = 2; i <= lastPage; i++) {
                items.push(i);
            }
            return items;
        }

        // For large number of pages, show dots
        if (currentPage > 3) {
            items.push('...');
        }

        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(lastPage - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            items.push(i);
        }

        if (currentPage < lastPage - 2) {
            items.push('...');
        }

        // Always show last page if not already included
        if (lastPage > 1) {
            items.push(lastPage);
        }

        return items;
    };

    const paginationItems = generatePaginationItems();

    return (
        <div className="mt-16 flex items-center justify-center">
            {pagination.last_page > 1 && (
                <div className="rounded-xl bg-white p-2 shadow-lg">
                    <div className="flex items-center">
                        <Link
                            href={
                                pagination.prev_page_url
                                    ? route(
                                          'home',
                                          createParams(
                                              pagination.current_page - 1,
                                          ),
                                      )
                                    : '#'
                            }
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                pagination.prev_page_url
                                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                    : 'cursor-not-allowed text-gray-300'
                            }`}
                            preserveScroll
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>

                        <div className="flex items-center space-x-1">
                            {paginationItems.map((item, index) =>
                                item === '...' ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="flex h-12 w-12 items-center justify-center text-gray-500"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <Link
                                        key={`page-${item}`}
                                        href={route(
                                            'home',
                                            createParams(item as number),
                                        )}
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl font-medium transition-all duration-300 ${
                                            pagination.current_page === item
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                        preserveScroll
                                    >
                                        {item}
                                    </Link>
                                ),
                            )}
                        </div>

                        <Link
                            href={
                                pagination.next_page_url
                                    ? route(
                                          'home',
                                          createParams(
                                              pagination.current_page + 1,
                                          ),
                                      )
                                    : '#'
                            }
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                pagination.next_page_url
                                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                    : 'cursor-not-allowed text-gray-300'
                            }`}
                            preserveScroll
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pagination;
