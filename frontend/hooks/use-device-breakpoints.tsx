'use client';

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type UseDeviceBreakpoints = {
    width: number;
    isMobile: boolean;
    isTablet: boolean;
};

export function useDeviceBreakpoints(): UseDeviceBreakpoints {
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
    const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth;
            setWidth(width);
            setIsMobile(width < MOBILE_BREAKPOINT);
            setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
        };

        updateBreakpoints();

        window.addEventListener('resize', updateBreakpoints);
        return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return {
        width,
        isMobile: !!isMobile,
        isTablet: !!isTablet
    };
}
