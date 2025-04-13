'use client';

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type UseDeviceBreakpoints = {
    width: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

export function useDeviceBreakpoints(): UseDeviceBreakpoints {
    const [width, setWidth] = React.useState<number>(0);
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
    const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);
    const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth;
            setWidth(width);

            const userAgent = navigator.userAgent;
            const isMobileByWidth = width < MOBILE_BREAKPOINT;
            const isTabletDevice =
                /iPad|Tablet|Android(?!.*Mobile)|SM-T/i.test(userAgent) ||
                (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent));
            const isMobilePhone =
                /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const finalIsMobile = isMobilePhone && !isTabletDevice;
            const finalIsTablet = isTabletDevice ||
                                 (width >= MOBILE_BREAKPOINT &&
                                  width < TABLET_BREAKPOINT &&
                                  !finalIsMobile);
            const finalIsDesktop = !finalIsMobile &&
                                  !finalIsTablet &&
                                  width >= TABLET_BREAKPOINT;
            setIsMobile(finalIsMobile || (isMobileByWidth && !isTabletDevice));
            setIsTablet(finalIsTablet);
            setIsDesktop(finalIsDesktop);
        };

        updateBreakpoints();

        window.addEventListener('resize', updateBreakpoints);
        return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return {
        width,
        isMobile: !!isMobile,
        isTablet: !!isTablet,
        isDesktop: !!isDesktop
    };
}
