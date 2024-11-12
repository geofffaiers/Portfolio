import { ErrorMessage } from './ErrorMessage'
import { NewMessage } from './NewMessage'
import { ReadMessage } from './ReadMessage'

export type SocketMessage = ErrorMessage | NewMessage | ReadMessage
