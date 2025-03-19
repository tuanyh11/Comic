import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import vi_VN from '@react-pdf-viewer/locales/lib/vi_VN.json';
import {
    ToolbarProps,
    ToolbarSlot,
    TransformToolbarSlot,
} from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { FC } from 'react';

interface PDFViewerProps {
    fileUrl: string;
}

const worker = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js';

const PDFViewer: FC<PDFViewerProps> = ({ fileUrl }) => {
    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
        return {
            ...slot,
            Download: () => <></>,
            PrintMenuItem: () => <></>,
            Print: () => <></>,
            Open: () => <></>,
        };
    };

    const renderToolbar = (
        Toolbar: (props: ToolbarProps) => React.ReactElement,
    ) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

    const { renderDefaultToolbar } =
        defaultLayoutPluginInstance.toolbarPluginInstance;

    return (
        <Worker workerUrl={worker}>
            <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                localization={vi_VN}
            />
        </Worker>
    );
};

export default PDFViewer;
