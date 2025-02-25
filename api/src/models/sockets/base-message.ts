import { IsEnum } from 'class-validator';
import { MessageType } from './message-type';
import { Expose } from 'class-transformer';

export class BaseMessage {
  @Expose({ name: 'type' })
  @IsEnum(MessageType)
      type: string | null = null;
}
