import { Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';
import { Player } from './player';
import { Game } from './game';

export class Room {
    @IsString()
    @Expose({ name: 'id' })
        id: string = '';

    @IsString()
    @Expose({ name: 'name' })
        name: string = '';

    @IsString()
    @Expose({ name: 'description' })
        description: string = '';

    @IsArray()
    @Expose({ name: 'players' })
    @ValidateNested({ each: true })
    @Type(() => Player)
        players: Player[] = [];

    @IsDate()
    @Expose({ name: 'createdAt' })
    @Type(() => Date)
        createdAt: Date = new Date();

    @IsDate()
    @Expose({ name: 'updatedAt' })
    @Type(() => Date)
        updatedAt: Date = new Date();

    @IsArray()
    @Expose({ name: 'games' })
    @ValidateNested({ each: true })
    @Type(() => Game)
        games: Game[] = [];
}
