import { RefObject, useEffect } from 'react';

/**
 * Hook to detect clicks outside of the specified element
 *
 * @param ref - Reference to the element to monitor
 * @param callback - Function to call when a click outside is detected
 * @param exceptRefs - Optional array of refs to exclude from outside click detection
 */
const useOutsideClick = (
    ref: RefObject<HTMLElement>,
    callback: () => void,
    exceptRefs: RefObject<HTMLElement>[] = [],
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click was outside the ref element
            if (ref.current && !ref.current.contains(event.target as Node)) {
                // Check if the click was inside any of the except refs
                const isInsideExceptRefs = exceptRefs.some(
                    (exceptRef) =>
                        exceptRef.current &&
                        exceptRef.current.contains(event.target as Node),
                );

                // If not inside any except refs, call the callback
                if (!isInsideExceptRefs) {
                    callback();
                }
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback, exceptRefs]);
};

export default useOutsideClick;
