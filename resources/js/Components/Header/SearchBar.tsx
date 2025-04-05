import useOutsideClick from '@/hooks/useOutsideClick';
import { Comic } from '@/types/custom';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    isSearchOpen: boolean;
    setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile?: boolean;
}

const SearchBar = ({
    isSearchOpen,
    setIsSearchOpen,
    isMobile = false,
}: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Comic[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Create a timeout ref for debouncing
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<HTMLDivElement>(null);

    // Use the custom hook to handle outside clicks for search results
    useOutsideClick(searchResultsRef, () => {
        setShowSearchResults(false);
    }, [searchInputRef]);

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Perform search API call
    const performSearch = async (query: string) => {
        if (!query.trim() || query.length < 1) return;

        try {
            const response = await axios.get('/api/comics/search', {
                params: { q: query },
            });
            setSearchResults(response.data.comics);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle input change with debounce
    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Show loading indicator immediately if query is valid
        if (query && query.length >= 1) {
            setIsSearching(true);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }

        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set a new timeout for 1 second
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, 1000);
    };

    // Navigate to full search results page
    const viewAllResults = () => {
        if (searchQuery.trim()) {
            router.get(route('comics.search'), { q: searchQuery });
            setShowSearchResults(false);
        }
    };

    return (
        <div
            className={`${
                isMobile
                    ? isSearchOpen
                        ? 'absolute left-0 right-0 top-1/2 z-50 flex -translate-y-1/2 bg-gradient-to-r from-blue-500 to-pink-500 p-2'
                        : 'hidden'
                    : 'relative flex bg-transparent'
            } md:relative md:flex md:bg-transparent`}
        >
            <div className="relative w-full">
                <div className="w-full">
                    <div className="relative flex w-full items-center">
                        <div className="relative flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={() => {
                                    if (searchResults.length > 0) {
                                        setShowSearchResults(true);
                                    }
                                }}
                                placeholder="Tìm kiếm truyện, tác giả..."
                                className="w-full rounded-full border border-pink-200 bg-white/90 py-2 pl-10 pr-4 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {isSearching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <FaSearch />
                                )}
                            </div>
                        </div>
                        {isMobile && isSearchOpen && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setShowSearchResults(false);
                                    setSearchQuery('');
                                }}
                                className="ml-2 p-2 text-white md:hidden"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                    <div
                        ref={searchResultsRef}
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg"
                    >
                        {isSearching ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <p className="mt-2">Đang tìm kiếm...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className="p-2">
                                    <h3 className="mb-2 px-2 text-sm font-semibold text-gray-500">
                                        Kết quả tìm kiếm
                                    </h3>
                                    <div className="divide-y">
                                        {searchResults
                                            .slice(0, 5)
                                            .map((comic) => (
                                                <Link
                                                    key={comic.id}
                                                    href={`/comic/${comic.id}`}
                                                    className="flex items-center gap-3 p-2 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setShowSearchResults(
                                                            false,
                                                        );
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    {comic?.media[0]?.media
                                                        ?.url && (
                                                        <img
                                                            src={
                                                                comic.media[0]
                                                                    .media.url
                                                            }
                                                            alt={comic.title}
                                                            className="h-12 w-12 rounded-md object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1 truncate">
                                                        <p className="font-medium text-gray-900">
                                                            {comic.title}
                                                        </p>
                                                        {comic.author && (
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    comic.author
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                    {searchResults.length > 5 && (
                                        <button
                                            onClick={viewAllResults}
                                            className="mt-2 w-full rounded-md bg-blue-50 p-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-100"
                                        >
                                            Xem tất cả {searchResults.length}{' '}
                                            kết quả
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : searchQuery.length >= 1 ? (
                            <div className="p-4 text-center text-gray-500">
                                <p>
                                    Không tìm thấy kết quả nào cho "
                                    {searchQuery}"
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
