import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Round } from '@/models/planning-poker';

export class UpdatedRound extends BaseMessage {
    type: MessageType.UPDATED_ROUND = MessageType.UPDATED_ROUND;

    @ValidateNested()
    @Type(() => Round)
    @Expose({ name: 'round' })
        round: Round;

    constructor (round: Round) {
        super();
        this.round = round;
    }
}
