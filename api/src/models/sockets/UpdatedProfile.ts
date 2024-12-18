import { ValidateNested } from 'class-validator'
import { BaseMessage } from './BaseMessage'
import { MessageType } from './MessageType'
import { Expose, Type } from 'class-transformer'
import { User } from '../User'

export class UpdatedProfile extends BaseMessage {
  type: MessageType.UPDATED_PROFILE = MessageType.UPDATED_PROFILE

  @ValidateNested()
  @Type(() => User)
  @Expose({ name: 'user' })
  user: User = new User()
}
