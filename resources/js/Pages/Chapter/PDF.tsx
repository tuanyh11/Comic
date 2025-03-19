import {
    ChevronLeft,
    ChevronRight,
    RotateCw,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFFlipbookProps {
    fileUrl: string;
}

const PDFFlipbook: React.FC<PDFFlipbookProps> = ({ fileUrl }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pageWidth, setPageWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                // Make page width responsive to container size
                const width = containerRef.current.clientWidth * 0.8; // 80% of container width
                setPageWidth(width);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setIsLoading(false);
    }

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => {
            const newPageNumber = prevPageNumber + offset;
            return Math.max(1, Math.min(numPages || 1, newPageNumber));
        });
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function zoomIn() {
        setScale((prevScale) => Math.min(prevScale + 0.2, 3));
    }

    function zoomOut() {
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
    }

    function rotateClockwise() {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    }

    // Animation for page turn effect
    const flipPage = (direction: 'next' | 'prev') => {
        if (pageRef.current) {
            pageRef.current.classList.add('page-flip');

            setTimeout(() => {
                if (direction === 'next') {
                    nextPage();
                } else {
                    previousPage();
                }

                if (pageRef.current) {
                    pageRef.current.classList.remove('page-flip');
                }
            }, 300);
        } else {
            // Fallback if ref not available
            direction === 'next' ? nextPage() : previousPage();
        }
    };

    return (
        <div className="flex h-full flex-col" ref={containerRef}>
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 p-2">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={zoomOut}
                        className="rounded p-2 hover:bg-gray-200"
                        title="Phóng nhỏ"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={zoomIn}
                        className="rounded p-2 hover:bg-gray-200"
                        title="Phóng to"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={rotateClockwise}
                        className="rounded p-2 hover:bg-gray-200"
                        title="Xoay trang"
                    >
                        <RotateCw size={20} />
                    </button>
                </div>

                <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                        {pageNumber} / {numPages || '--'}
                    </span>
                </div>
            </div>

            {/* Document viewer */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto bg-gray-800">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                            <p className="mt-4 text-gray-700">
                                Đang tải tài liệu...
                            </p>
                        </div>
                    </div>
                )}

                {/* Previous page button */}
                <button
                    onClick={() => flipPage('prev')}
                    disabled={pageNumber <= 1}
                    className={`absolute left-4 z-10 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white ${
                        pageNumber <= 1 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Document */}
                <div
                    ref={pageRef}
                    className="mx-auto shadow-xl transition-transform duration-300"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }}
                >
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex h-96 w-full items-center justify-center">
                                Đang tải...
                            </div>
                        }
                        error={
                            <div className="text-center text-red-500">
                                Không thể tải tài liệu. Vui lòng thử lại sau.
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            rotate={rotation}
                            width={pageWidth}
                            loading={
                                <div className="flex h-96 w-96 items-center justify-center">
                                    Đang tải trang...
                                </div>
                            }
                            className="page-transition"
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                </div>

                {/* Next page button */}
                <button
                    onClick={() => flipPage('next')}
                    disabled={numPages !== null && pageNumber >= numPages}
                    className={`absolute right-4 z-10 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white ${
                        numPages !== null && pageNumber >= numPages
                            ? 'cursor-not-allowed opacity-50'
                            : ''
                    }`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Bottom controls - page navigation */}
            <div className="border-t border-gray-200 bg-gray-100 p-3">
                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={() => setPageNumber(1)}
                        disabled={pageNumber <= 1}
                        className={`rounded border px-3 py-1 text-sm hover:bg-gray-200 ${
                            pageNumber <= 1
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                        }`}
                    >
                        Trang đầu
                    </button>
                    <button
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                        className={`flex items-center rounded border px-3 py-1 hover:bg-gray-200 ${
                            pageNumber <= 1
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                        }`}
                    >
                        <ChevronLeft size={16} />
                        Trước
                    </button>

                    <div className="flex items-center">
                        <input
                            type="number"
                            min={1}
                            max={numPages || 1}
                            value={pageNumber}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (
                                    !isNaN(value) &&
                                    value >= 1 &&
                                    (numPages === null || value <= numPages)
                                ) {
                                    setPageNumber(value);
                                }
                            }}
                            className="w-16 rounded border px-2 py-1 text-center text-sm"
                        />
                        <span className="mx-2 text-sm text-gray-600">
                            / {numPages || '--'}
                        </span>
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={numPages !== null && pageNumber >= numPages}
                        className={`flex items-center rounded border px-3 py-1 hover:bg-gray-200 ${
                            numPages !== null && pageNumber >= numPages
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                        }`}
                    >
                        Tiếp
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => numPages && setPageNumber(numPages)}
                        disabled={numPages !== null && pageNumber >= numPages}
                        className={`rounded border px-3 py-1 text-sm hover:bg-gray-200 ${
                            numPages !== null && pageNumber >= numPages
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                        }`}
                    >
                        Trang cuối
                    </button>
                </div>
            </div>

            {/* CSS for page flip animation */}
            <style jsx>{`
                .page-flip {
                    animation: flipAnimation 0.3s ease-in-out;
                }

                @keyframes flipAnimation {
                    0% {
                        transform: translateX(0) rotateY(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(20px) rotateY(10deg);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(0) rotateY(0deg);
                        opacity: 1;
                    }
                }

                .page-transition {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default PDFFlipbook;
