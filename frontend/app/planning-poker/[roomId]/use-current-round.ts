import { RefObject, useEffect, useRef, useState } from 'react';

import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';
import { Round } from '@/models';

type UseCurrentRound = {
    containerRef: RefObject<HTMLDivElement | null>;
    radius: number;
    isMobile: boolean;
    displayMetrics: boolean;
    setDisplayMetrics: (value: boolean) => void;
};

type Props = {
    round: Round;
};

export const useCurrentRound = ({ round }: Props): UseCurrentRound => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [radius, setRadius] = useState<number>(0);
    const [displayMetrics, setDisplayMetrics] = useState<boolean>(false);
    const { isMobile } = useDeviceBreakpoints();
    const previousRoundRef = useRef<Round | null>(null);

    useEffect(() => {
        if (round.id !== previousRoundRef.current?.id && !round.inProgress) {
            setDisplayMetrics(true);
            previousRoundRef.current = round;
        }
    }, [round]);

    useEffect(() => {
        const updateRadius = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setRadius(containerWidth * (isMobile ? 0.1 : 0.2));
            }
        };

        updateRadius();

        const resizeObserver = new ResizeObserver(updateRadius);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [isMobile]);

    return {
        containerRef,
        radius,
        isMobile,
        displayMetrics,
        setDisplayMetrics,
    };
};
