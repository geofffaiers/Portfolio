import { User } from '@/models';
import { ChatHeader } from './chat-header';

export type Messaging = {
  loading: boolean;
  chatHeaders: ChatHeader[];
  openChats: User[];
  displayConversations: boolean;
  handleOpenChat: (user: User) => void;
  handleCloseChat: (user: User) => void;
  handleOpenMessaging: () => void;
};
