import { FC } from 'react';

interface ComicDescriptionProps {
    description: string;
}

const ComicDescription: FC<ComicDescriptionProps> = ({ description }) => {
    return (
        <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Giới thiệu
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: description,
                }}
                className="rounded-lg bg-blue-50 p-4 text-gray-700"
            ></div>
        </div>
    );
};

export default ComicDescription;
