import { User } from '@/models';
import { ChatHeader } from './chat-header';

export type Messaging = {
    floatingOpen: boolean;
    initialLoading: boolean;
    loading: boolean;
    chatHeaders: ChatHeader[];
    openChats: User[];
    pageChat: User | null;
    displayConversations: boolean;
    setPageChat: (user: User | null) => void;
    handleOpenChat: (user: User) => void;
    handleCloseChat: (user: User) => void;
    handleCloseFloatingMessaging: () => void;
    handleOpenFloatingMessaging: () => void;
};

export type MessagingType = 'page' | 'floating';
