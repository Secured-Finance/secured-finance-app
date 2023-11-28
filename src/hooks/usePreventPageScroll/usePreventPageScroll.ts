import { RefObject, useEffect, useRef } from 'react';

// Custom hook to prevent page scrolling when interacting with a specific element
export function usePreventPageScroll<T extends HTMLElement>(
    ref: RefObject<T>
): void {
    const isDragging = useRef<boolean>(false);

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (ref.current && ref.current.contains(e.target as Node)) {
                isDragging.current = true;
                e.preventDefault();
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging.current) {
                // Prevent scrolling when dragging
                e.preventDefault();
            }
        };

        const handlePointerUp = () => {
            isDragging.current = false;
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
    }, [ref]);
}
