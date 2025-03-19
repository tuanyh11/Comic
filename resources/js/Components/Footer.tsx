import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-600 to-pink-500 py-12 text-white">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h4 className="mb-4 text-xl font-bold">Công ty</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Giới thiệu
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Tuyển dụng
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Tin tức
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-xl font-bold">Cộng đồng</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Diễn đàn
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Tác giả
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Blog
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-xl font-bold">Hỗ trợ</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Trung tâm trợ giúp
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Liên hệ
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-colors hover:text-yellow-300"
                            >
                                Câu hỏi thường gặp
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-xl font-bold">Kết nối</h4>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="text-white transition-colors hover:text-yellow-300"
                            aria-label="Facebook"
                        >
                            <Facebook size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-white transition-colors hover:text-yellow-300"
                            aria-label="Twitter"
                        >
                            <Twitter size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-white transition-colors hover:text-yellow-300"
                            aria-label="Instagram"
                        >
                            <Instagram size={24} />
                        </a>
                    </div>
                    <div className="mt-6">
                        <h5 className="mb-2 text-lg font-semibold">
                            Theo dõi tin tức
                        </h5>
                        <div className="mt-2 flex">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full rounded-l-lg border-none px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button className="rounded-r-lg bg-yellow-400 px-4 py-2 font-medium text-blue-800 transition-colors hover:bg-yellow-300">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-8 border-t border-white/20 px-4 pt-6 text-center">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <p>&copy; 2024 Wattpad. Tất cả các quyền được bảo lưu.</p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <a
                            href="#"
                            className="text-sm transition-colors hover:text-yellow-300"
                        >
                            Điều khoản sử dụng
                        </a>
                        <a
                            href="#"
                            className="text-sm transition-colors hover:text-yellow-300"
                        >
                            Chính sách bảo mật
                        </a>
                        <a
                            href="#"
                            className="text-sm transition-colors hover:text-yellow-300"
                        >
                            Cookie
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
