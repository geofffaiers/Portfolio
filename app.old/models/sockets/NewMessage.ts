import { ValidateNested } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'
import { Expose, Type } from 'class-transformer'
import { Message } from '../Message'

export class NewMessage extends BaseMessage {
  type: MessageType.NEW_MESSAGE = MessageType.NEW_MESSAGE

  @ValidateNested()
  @Type(() => Message)
  @Expose({ name: 'message' })
  message: Message

  constructor (message: Message) {
    super()
    this.message = message
  }
}
