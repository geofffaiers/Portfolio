import { IsNumber } from 'class-validator';
import { BaseMessage } from './base-message';
import { MessageType } from './message-type';
import { Expose } from 'class-transformer';

export class ReadMessage extends BaseMessage {
    type: MessageType.READ_MESSAGE = MessageType.READ_MESSAGE;

  @IsNumber()
  @Expose({ name: 'messageId' })
      messageId: number = -1;
}
