import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useSidebar } from '@/components/ui/sidebar';

type UseLogout = {
  handleLogout: () => Promise<void>
}

export function useLogout(): UseLogout {
    const router = useRouter();
    const pathname = usePathname();
    const { config } = useConfigContext();
    const { isMobile, setOpenMobile } = useSidebar();
    const { setUser } = useAuthContext();

    const handleLogout = useCallback(async () => {
        try {
            await fetch(`${config.apiUrl}/users/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
        } catch (_err: unknown) {
            // Ignore errors, we still need to handle the logout on the frontend
        } finally {
            localStorage.removeItem('loggedInUser');
            setUser(null);
            if (pathname === '/account' || /^\/planning-poker\/.+/.test(pathname)) {
                if (isMobile) {
                    setOpenMobile(false);
                }
                router.push('/');
            }
        }
    }, [config.apiUrl, setUser, pathname, router, isMobile, setOpenMobile]);

    return {
        handleLogout
    };
}
