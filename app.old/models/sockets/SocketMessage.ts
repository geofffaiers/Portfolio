import { DeleteProfile } from './DeleteProfile'
import { ErrorMessage } from './ErrorMessage'
import { NewMessage } from './NewMessage'
import { ReadMessage } from './ReadMessage'
import { UpdatedMessage } from './UpdatedMessage'
import { UpdatedProfile } from './UpdatedProfile'

export type SocketMessage = DeleteProfile | ErrorMessage | NewMessage | ReadMessage | UpdatedMessage | UpdatedProfile
