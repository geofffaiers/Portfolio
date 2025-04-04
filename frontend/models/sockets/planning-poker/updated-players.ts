import { IsArray, ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Player } from '@/models/planning-poker';

export class UpdatedPlayers extends BaseMessage {
    type: MessageType.UPDATED_PLAYERS = MessageType.UPDATED_PLAYERS;

    @IsArray()
    @ValidateNested()
    @Type(() => Player)
    @Expose({ name: 'players' })
        players: Player[];

    constructor (players: Player[]) {
        super();
        this.players = players;
    }
}
