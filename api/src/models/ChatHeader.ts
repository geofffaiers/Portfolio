import { Expose, Type } from 'class-transformer'
import { User } from './User'
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator'

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
  @Expose({ name: 'isUnread' })
  @IsBoolean()
  lastSentMessageRead?: boolean
}