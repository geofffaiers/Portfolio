import { User } from '@/models';
import { useMemo } from 'react';

type UseUserDetails = {
    userName: string | undefined
    initials: string | undefined
}

export function useUserDetails({ user }: { user: User | null | undefined }): UseUserDetails {

    const userName = useMemo((): string | undefined => {
        if (user == null) {
            return undefined;
        }
        if (user.firstName != null && user.lastName != null) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user.firstName != null) {
            return user.firstName;
        }
        if (user.lastName != null) {
            return user.lastName;
        }
        return user.username;
    }, [user]);

    const initials = useMemo((): string | undefined => {
        return userName?.split(' ').map((name: string) => name[0]).join('');
    }, [userName]);

    return {
        userName,
        initials
    };
}
