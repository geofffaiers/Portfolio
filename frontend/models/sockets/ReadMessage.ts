import { IsNumber } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'
import { Expose } from 'class-transformer'

export class ReadMessage extends BaseMessage {
  type: MessageType.READ_MESSAGE = MessageType.READ_MESSAGE

  @IsNumber()
  @Expose({ name: 'messageId' })
  messageId: number = -1
}
