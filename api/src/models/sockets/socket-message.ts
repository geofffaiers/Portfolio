import { DeleteProfile } from './delete-profile';
import { ErrorMessage } from './error-message';
import { NewMessage } from './new-message';
import { ReadMessage } from './read-message';
import { UpdatedMessage } from './updated-message';
import { UpdatedProfile } from './updated-profile';

export type SocketMessage = DeleteProfile | ErrorMessage | NewMessage | ReadMessage | UpdatedMessage | UpdatedProfile
