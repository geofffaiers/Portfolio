import { Expose, Type } from 'class-transformer'
import { User } from './User'
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Message } from './Message'

export class ChatHeader {
  @Expose({ name: 'user' })
  @Type(() => User)
  @ValidateNested()
  user: User = new User()

  @IsOptional()
  @Expose({ name: 'lastMessage' })
  @IsString()
  lastMessage?: string

  @IsOptional()
  @Expose({ name: 'lastMessageTime' })
  @IsDate()
  @Type(() => Date)
  lastMessageTime?: Date

  @IsOptional()
  @Type(() => Message)
  @Expose({ name: 'lastReceivedMessage'})
  @ValidateNested()
  lastReceivedMessage?: Message
}