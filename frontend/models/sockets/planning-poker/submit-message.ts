import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Vote } from '@/models/planning-poker';

export class SubmitMessage extends BaseMessage {
    type: MessageType.SUBMIT_SCORE = MessageType.SUBMIT_SCORE;

    @ValidateNested()
    @Type(() => Vote)
    @Expose({ name: 'vote' })
        vote: Vote;

    constructor (vote: Vote) {
        super();
        this.vote = vote;
    }
}
