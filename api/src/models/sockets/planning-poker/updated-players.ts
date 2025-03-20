import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Player } from '../../planning-poker';

export class UpdatedPlayers extends BaseMessage {
    type: MessageType.UPDATED_PLAYERS = MessageType.UPDATED_PLAYERS;

    @ValidateNested()
    @ValidateNested({ each: true })
    @Type(() => Player)
    @Expose({ name: 'players' })
        players: Player[];

    constructor (players: Player[]) {
        super();
        this.players = players;
    }
}
