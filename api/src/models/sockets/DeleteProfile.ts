import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'

export class DeleteProfile extends BaseMessage {
  type: MessageType.DELETE_PROFILE = MessageType.DELETE_PROFILE
}
