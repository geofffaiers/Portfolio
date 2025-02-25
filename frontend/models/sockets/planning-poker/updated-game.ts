import { ValidateNested } from 'class-validator';
import { BaseMessage } from '../base-message';
import { MessageType } from '../message-type';
import { Expose, Type } from 'class-transformer';
import { Game } from '@/models/planning-poker';

export class UpdatedGame extends BaseMessage {
    type: MessageType.UPDATED_GAME = MessageType.UPDATED_GAME;

    @ValidateNested()
    @Type(() => Game)
    @Expose({ name: 'game' })
        game: Game;

    constructor (game: Game) {
        super();
        this.game = game;
    }
}
