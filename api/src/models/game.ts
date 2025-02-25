import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import { Round } from "./planning-poker/round";

export class Game {
    @IsNumber()
    @Expose({ name: 'id' })
    id: number = -1;

    @IsString()
    @Expose({ name: 'roomId' })
    roomId: string = '';

    @IsString()
    @Expose({ name: 'name' })
    name: string = '';

    @IsBoolean()
    @Expose({ name: 'inProgress' })
    inProgress: boolean = false;

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
    @ValidateNested({ each: true })
    @Expose({ name: 'rounds' })
    @Type(() => Round)
    rounds: Round[] = [];
}