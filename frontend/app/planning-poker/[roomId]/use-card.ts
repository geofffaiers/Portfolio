import { RefObject, useEffect, useRef, useState } from 'react';

type UseCard = {
    containerRef: RefObject<HTMLDivElement | null>;
    width: number;
};

export const useCard = (): UseCard => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const updateRadius = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setWidth(containerWidth * 0.3);
            }
        };

        updateRadius();

        const resizeObserver = new ResizeObserver(updateRadius);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return {
        containerRef,
        width,
    };
};
