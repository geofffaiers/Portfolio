import { Expose, Type } from 'class-transformer';
import { User } from './user';
import { IsOptional, ValidateNested } from 'class-validator';
import { Message } from './message';

export class ChatHeader {
  @Expose({ name: 'user' })
  @Type(() => User)
  @ValidateNested()
      user: User = new User();

  @IsOptional()
  @Type(() => Message)
  @Expose({ name: 'lastMessage' })
  @ValidateNested()
      lastMessage?: Message;

  @IsOptional()
  @Type(() => Message)
  @Expose({ name: 'lastReceivedMessage' })
  @ValidateNested()
      lastReceivedMessage?: Message;
}
