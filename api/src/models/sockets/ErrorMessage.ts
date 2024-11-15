import { IsString } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'
import { Expose } from 'class-transformer'

export class ErrorMessage extends BaseMessage {
  type: MessageType.ERROR = MessageType.ERROR

  @IsString()
  @Expose({ name: 'message' })
  message: string = ''
}
