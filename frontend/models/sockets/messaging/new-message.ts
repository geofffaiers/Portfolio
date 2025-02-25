import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Message } from '../../../features/messaging/types/message';

export class NewMessage extends BaseMessage {
    type: MessageType.NEW_MESSAGE = MessageType.NEW_MESSAGE;

    @ValidateNested()
    @Type(() => Message)
    @Expose({ name: 'message' })
        message: Message;

    constructor (message: Message) {
        super();
        this.message = message;
    }
}
