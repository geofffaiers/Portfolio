import { ErrorMessage } from './ErrorMessage'
import { NewMessage } from './NewMessage'
import { ReadMessage } from './ReadMessage'
import { UpdatedMessage } from './UpdatedMessage'

export type SocketMessage = ErrorMessage | NewMessage | ReadMessage | UpdatedMessage
