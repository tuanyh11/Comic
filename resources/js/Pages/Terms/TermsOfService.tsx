import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface TermsProps {
    terms: {
        title: string;
        content: string;
        version: number;
        published_at: string;
    } | null;
}

const TermsOfService: React.FC<TermsProps> = ({ terms }) => {
    return (
        <DefaultLayout>
            <Head title="Điều khoản sử dụng" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            {terms ? (
                                <div>
                                    <h1 className="mb-6 text-3xl font-bold text-gray-800">
                                        {terms.title}
                                    </h1>

                                    <div className="mb-8 flex items-center text-sm text-gray-500">
                                        <span className="mr-4">
                                            Phiên bản: {terms.version}
                                        </span>
                                        <span>
                                            Cập nhật: {terms.published_at}
                                        </span>
                                    </div>

                                    <div
                                        className="prose prose-blue max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: terms.content,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <h2 className="text-2xl font-semibold text-gray-700">
                                        Điều khoản sử dụng chưa được cập nhật
                                    </h2>
                                    <p className="mt-2 text-gray-500">
                                        Vui lòng quay lại sau.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default TermsOfService;
