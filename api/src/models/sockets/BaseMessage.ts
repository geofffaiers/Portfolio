import { IsEnum } from 'class-validator'
import { MessageType } from './MessageType'
import { Expose } from 'class-transformer'

export class BaseMessage {
  @Expose({ name: 'type' })
  @IsEnum(MessageType)
  type: string | null = null
}
