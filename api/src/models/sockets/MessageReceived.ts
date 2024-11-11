import { IsString } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'

export class MessageReceived extends BaseMessage {
  type: MessageType.MESSAGE_RECEIVED = MessageType.MESSAGE_RECEIVED

  @IsString()
    message: string = ''
}
