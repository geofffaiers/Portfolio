import { DeleteProfile } from './profile/delete-profile';
import { ErrorMessage } from './error-message';
import { NewMessage } from './messaging/new-message';
import { ReadMessage } from './messaging/read-message';
import { UpdatedMessage } from './messaging/updated-message';
import { UpdatedProfile } from './profile/updated-profile';

export type SocketMessage = DeleteProfile | ErrorMessage | NewMessage | ReadMessage | UpdatedMessage | UpdatedProfile
