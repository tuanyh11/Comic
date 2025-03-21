// @/Components/Home/HeroSection.tsx
import { Link } from '@inertiajs/react';
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-pink-900/80"></div>
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="max-w-xl text-white">
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                            Khám phá những câu chuyện tuyệt vời
                        </h1>
                        <p className="mb-6 text-lg opacity-90">
                            Hàng ngàn câu chuyện thú vị đang chờ đón bạn - đọc,
                            chia sẻ và kết nối với cộng đồng yêu thích truyện.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#home-comic"
                                className="rounded-full bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-blue-300/50"
                            >
                                Khám phá ngay
                            </Link>
                            <Link
                                href="#home-genre"
                                className="rounded-full border border-white bg-transparent px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10"
                            >
                                Xem thể loại
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
