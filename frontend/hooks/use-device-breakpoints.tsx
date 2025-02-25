import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useDeviceBreakpoints() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
    const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth;
            setIsMobile(width < MOBILE_BREAKPOINT);
            setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
        };

        updateBreakpoints();

        window.addEventListener('resize', updateBreakpoints);
        return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return {
        isMobile: !!isMobile,
        isTablet: !!isTablet
    };
}
