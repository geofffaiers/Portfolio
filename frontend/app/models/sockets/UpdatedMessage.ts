import { ValidateNested } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'
import { Expose, Type } from 'class-transformer'
import { Message } from '../Message'

export class UpdatedMessage extends BaseMessage {
  type: MessageType.UPDATED_MESSAGE = MessageType.UPDATED_MESSAGE

  @ValidateNested()
  @Type(() => Message)
  @Expose({ name: 'message' })
  message: Message = new Message()
}
