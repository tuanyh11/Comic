import { useEffect } from 'react';

interface RedirectProps {
    url: string;
}

export default function Redirect({ url }: RedirectProps) {
    useEffect(() => {
        // Chuyển hướng sang VNPay sau khi trang load
        if (url) {
            window.location.href = url;
        }
    }, [url]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">
                    Đang chuyển hướng đến cổng thanh toán
                </h1>
                <p className="mt-4">Vui lòng đợi trong giây lát...</p>
                <p className="mt-2">
                    <a href={url} className="text-blue-500 underline">
                        Nhấn vào đây nếu bạn không được chuyển hướng tự động
                    </a>
                </p>
            </div>
        </div>
    );
}
