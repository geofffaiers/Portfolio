import { useAuthContext } from '@/components/providers/auth-provider';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

type UseLogout = {
  handleLogout: () => void
}

export function useLogout(): UseLogout {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser } = useAuthContext();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
        if (pathname === '/account') {
            router.push('/');
        }
    }, [setUser, pathname, router]);

    return {
        handleLogout
    };
}
