import { IsString } from 'class-validator';
import { BaseMessage } from './base-message';
import { MessageType } from './message-type';
import { Expose } from 'class-transformer';

export class ErrorMessage extends BaseMessage {
    type: MessageType.ERROR = MessageType.ERROR;

  @IsString()
  @Expose({ name: 'message' })
      message: string = '';
}
