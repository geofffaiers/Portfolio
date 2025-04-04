import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Room } from '../../planning-poker';

export class UpdatedRoom extends BaseMessage {
    type: MessageType.UPDATED_ROOM = MessageType.UPDATED_ROOM;

    @ValidateNested()
    @Type(() => Room)
    @Expose({ name: 'room' })
        room: Room;

    constructor (room: Room) {
        super();
        this.room = room;
    }
}
