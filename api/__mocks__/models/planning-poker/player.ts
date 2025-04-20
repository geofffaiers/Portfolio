import { mockUser1 } from "../user";

export const mockOwner = (roomId: string) => {
    const user = mockUser1();
    return {
        ...user,
        roomId,
        online: true,
        role: 'owner'
    };
};

export const mockPlayer = (roomId: string) => {
    const user = mockUser1();
    return {
        ...user,
        roomId,
        online: true,
        role: 'player'
    };
};

export const mockObserver = (roomId: string) => {
    const user = mockUser1();
    return {
        ...user,
        roomId,
        online: true,
        role: 'observer'
    };
};