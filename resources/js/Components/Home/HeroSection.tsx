// @/Components/Home/HeroSection.tsx
import { Link } from '@inertiajs/react';
import { BookOpen, Search } from 'lucide-react';
import { FC } from 'react';

const HeroSection: FC = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/storage/media/bb2f14e1-a9d9-46d7-912b-a6d0ae19409b.jpeg"
                    alt="Hero Background"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-pink-900/80"></div>
            </div>

            {/* Animated Shape Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl"></div>
                <div className="absolute right-60 top-40 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
                <div className="absolute -bottom-40 left-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
                <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
                    <div className="max-w-2xl">
                        <span className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-md">
                            Nền tảng đọc truyện hàng đầu
                        </span>
                        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                            Khám phá thế giới{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                truyện tranh
                            </span>{' '}
                            diệu kỳ
                        </h1>
                        <p className="mb-8 text-lg leading-relaxed text-white/90">
                            Hàng ngàn câu chuyện thú vị đang chờ đón bạn - đọc,
                            chia sẻ và kết nối với cộng đồng yêu thích truyện
                            tranh lớn nhất Việt Nam.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="#home-comic"
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30"
                            >
                                <BookOpen className="h-5 w-5" />
                                Đọc ngay
                            </Link>
                            <Link
                                href="#home-genre"
                                className="flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                            >
                                <Search className="h-5 w-5" />
                                Khám phá thể loại
                            </Link>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
                            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-md">
                                <div className="text-3xl font-bold text-white">
                                    1000+
                                </div>
                                <div className="text-sm text-white/70">
                                    Tác phẩm
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-md">
                                <div className="text-3xl font-bold text-white">
                                    500K+
                                </div>
                                <div className="text-sm text-white/70">
                                    Người đọc
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-md">
                                <div className="text-3xl font-bold text-white">
                                    50+
                                </div>
                                <div className="text-sm text-white/70">
                                    Thể loại
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Optional: Featured Comics Section */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <div className="absolute -left-4 top-4 h-72 w-48 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-30 blur-xl"></div>
                            <div className="relative aspect-[2/3] h-80 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl">
                                <img
                                    src="/storage/media/bb2f14e1-a9d9-46d7-912b-a6d0ae19409b.jpeg"
                                    alt="Featured Comic"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 w-full p-4">
                                    <div className="rounded-lg bg-white/20 p-3 backdrop-blur-lg">
                                        <div className="text-sm font-bold text-white">
                                            Truyện nổi bật
                                        </div>
                                        <div className="mt-1 text-xs text-white/80">
                                            Cập nhật hàng ngày
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
