import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Message } from '../../../features/messaging/types/message';

export class UpdatedMessage extends BaseMessage {
    type: MessageType.UPDATED_MESSAGE = MessageType.UPDATED_MESSAGE;

    @ValidateNested()
    @Type(() => Message)
    @Expose({ name: 'message' })
        message: Message = new Message();
}
