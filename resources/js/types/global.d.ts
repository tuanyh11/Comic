import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
        DFLIP: {
            defaults: DFlipConfig;
        };
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

// Đầu tiên, định nghĩa các enum cho các giá trị cố định
declare namespace DFLIP {
    enum DIRECTION {
        LTR = 1,
        RTL = 2,
    }

    enum PAGE_MODE {
        AUTO = 0,
        SINGLE = 1,
        DOUBLE = 2,
    }

    enum SINGLE_PAGE_MODE {
        AUTO = 0,
        ZOOM = 1,
        BOOKLET = 2,
    }

    enum PAGE_SIZE {
        AUTO = 'auto',
    }

    enum CONTROLSPOSITION {
        BOTTOM = 'bottom',
        // Có thể có các giá trị khác tùy thư viện
    }
}

// Interface chính cho cấu hình DFLIP
interface DFlipConfig {
    // Các thuộc tính cơ bản
    webgl: boolean;
    webglShadow: boolean;
    soundEnable: boolean;
    height: number | string;
    autoEnableOutline: boolean;
    autoEnableThumbnail: boolean;
    overwritePDFOutline: boolean;
    showDownloadControl: boolean;
    showSearchControl: boolean;
    showPrintControl: boolean;
    duration: number;
    direction: DFLIP.DIRECTION;
    pageMode: DFLIP.PAGE_MODE;
    singlePageMode: DFLIP.SINGLE_PAGE_MODE;
    backgroundColor: string;
    forceFit: boolean;
    transparent: boolean;
    hard: 'all' | 'none' | 'cover';
    annotationClass: string;
    autoPlay: boolean;
    autoPlayDuration: number;
    autoPlayStart: boolean;

    // Cấu hình texture
    maxTextureSize: number;
    minTextureSize: number;
    rangeChunkSize: number;

    // Icons
    icons: {
        [key: string]: string;
        altnext: string;
        altprev: string;
        next: string;
        prev: string;
        end: string;
        start: string;
        share: string;
        help: string;
        more: string;
        download: string;
        zoomin: string;
        zoomout: string;
        fullscreen: string;
        fitscreen: string;
        thumbnail: string;
        outline: string;
        close: string;
        doublepage: string;
        singlepage: string;
        sound: string;
        facebook: string;
        google: string;
        twitter: string;
        mail: string;
        play: string;
        pause: string;
    };

    // Text
    text: {
        toggleSound: string;
        toggleThumbnails: string;
        toggleOutline: string;
        previousPage: string;
        nextPage: string;
        toggleFullscreen: string;
        zoomIn: string;
        zoomOut: string;
        toggleHelp: string;
        singlePageMode: string;
        doublePageMode: string;
        downloadPDFFile: string;
        gotoFirstPage: string;
        gotoLastPage: string;
        play: string;
        pause: string;
        share: string;
    };

    // Controls
    allControls: string;
    moreControls: string;
    hideControls: string;
    controlsPosition: DFLIP.CONTROLSPOSITION;
    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;
    scrollWheel: boolean;

    // Callbacks
    onCreate?: (flipBook: any) => void;
    onCreateUI?: (flipBook: any) => void;
    onFlip?: (flipBook: any) => void;
    beforeFlip?: (flipBook: any) => void;
    onReady?: (flipBook: any) => void;

    // Zoom và kích thước
    zoomRatio: number;
    pageSize: DFLIP.PAGE_SIZE;

    // Các thuộc tính không phải option (non-options)
    pdfjsSrc?: string;
    pdfjsCompatibilitySrc?: string;
    pdfjsWorkerSrc?: string;
    threejsSrc?: string;
    mockupjsSrc?: string;
    soundFile?: string;
    imagesLocation?: string;
    imageResourcesPath?: string;
    cMapUrl?: string;
    enableDebugLog?: boolean;
    canvasToBlob?: boolean;
    enableAnnotation?: boolean;
    pdfRenderQuality?: number;
    textureLoadFallback?: string;
    stiffness?: number;
    backgroundImage?: string;
    pageRatio?: number | null;
    pixelRatio?: number;
    thumbElement?: string;

    // 3D settings
    spotLightIntensity?: number;
    ambientLightColor?: string;
    ambientLightIntensity?: number;
    shadowOpacity?: number;
}
