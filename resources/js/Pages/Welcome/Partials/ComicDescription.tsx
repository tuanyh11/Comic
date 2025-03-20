import React, { useState } from 'react';

interface ComicDescriptionProps {
    description: string;
}

const ComicDescription: React.FC<ComicDescriptionProps> = ({ description }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    if (!description) return null;

    return (
        <>
            <div
                dangerouslySetInnerHTML={{
                    __html: description,
                }}
                className={`mb-8 max-w-3xl rounded-lg border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur-sm transition-all duration-300 ${
                    !showFullDescription && 'line-clamp-3'
                }`}
            ></div>

            {description.length > 150 && (
                <button
                    onClick={toggleDescription}
                    className="mb-6 flex items-center text-sm text-white transition-colors hover:text-blue-200"
                >
                    {showFullDescription ? 'Ẩn bớt' : 'Xem thêm'}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`ml-1 h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            )}
        </>
    );
};

export default ComicDescription;
