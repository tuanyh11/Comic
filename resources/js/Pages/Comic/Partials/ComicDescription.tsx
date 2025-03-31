import { FileText } from 'lucide-react';
import { FC } from 'react';

interface ComicDescriptionProps {
    description: string;
}

const ComicDescription: FC<ComicDescriptionProps> = ({ description }) => {
    return (
        <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-800">
                <FileText className="h-5 w-5 text-indigo-500" />
                Giới thiệu
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: description,
                }}
                className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-fuchsia-50 p-5 leading-relaxed text-gray-700 shadow-sm"
            ></div>
        </div>
    );
};

export default ComicDescription;
