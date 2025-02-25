import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsString, ValidateNested } from "class-validator";
import { Player } from "./player";
import { Game } from "./game";

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
    @ValidateNested({ each: true })
    @Type(() => Player)
    players: Player[] = [];

    @IsDate()
    @Expose({ name: 'createdAt' })
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.created_at, { toClassOnly: true })
    createdAt: Date = new Date();

    @IsDate()
    @Expose({ name: 'updatedAt' })
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.updated_at, { toClassOnly: true })
    updatedAt: Date = new Date();

    @IsArray()
    @Expose({ name: 'games' })
    @ValidateNested({ each: true})
    @Type(() => Game)
    games: Game[] = [];
}