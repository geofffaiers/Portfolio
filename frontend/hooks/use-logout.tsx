import { useAuthContext } from '@/components/providers/auth-provider';
import { useSidebar } from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

type UseLogout = {
  handleLogout: () => void
}

export function useLogout(): UseLogout {
    const router = useRouter();
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();
    const { setUser } = useAuthContext();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
        if (pathname === '/account' || /^\/planning-poker\/.+/.test(pathname)) {
            if (isMobile) {
                setOpenMobile(false);
            }
            router.push('/');
        }
    }, [setUser, pathname, router, isMobile, setOpenMobile]);

    return {
        handleLogout
    };
}
