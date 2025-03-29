import { Chapter } from '@/types/custom';
import { FC, useEffect, useRef } from 'react';

interface ChapterPreviewModalProps {
    selectedChapter: Chapter | null;
}

const ChapterPreviewModal: FC<ChapterPreviewModalProps> = ({
    selectedChapter,
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        // Handle click outside modal
        const handleClickOutside = (event: MouseEvent) => {
            const dialog = dialogRef.current;
            if (dialog && event.target === dialog) {
                dialog.close();
            }
        };

        // Add event listener
        document.addEventListener('click', handleClickOutside);

        // Clean up
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <dialog
            id="my_modal_3"
            className="modal h-screen w-full bg-transparent"
            ref={dialogRef}
        >
            <div className="modal-box h-full">
                <form className="fixed right-0 top-0 z-20" method="dialog">
                    <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/70 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gray-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </form>
                <div className="h-[100dvh]">
                    {selectedChapter?.id && (
                        <iframe
                            className="h-full w-full"
                            src={`${window.location.href}/chapter/${selectedChapter?.id}/preview`}
                        ></iframe>
                    )}
                </div>
            </div>
        </dialog>
    );
};

export default ChapterPreviewModal;
