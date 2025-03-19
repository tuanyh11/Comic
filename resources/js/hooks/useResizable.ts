import { useEffect, useRef, useState } from 'react';

const useResizable = (initialWidth: number) => {
    const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const mouseX = containerRect.right - e.clientX;

            // Set limits for resizing (min: 250px, max: 50% of container)
            const minWidth = 250;
            const maxWidth = containerWidth * 0.5;
            const newWidth = Math.max(minWidth, Math.min(maxWidth, mouseX));

            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return {
        sidebarWidth,
        isDragging,
        containerRef,
        resizerRef,
        handleMouseDown,
    };
};

export default useResizable;
