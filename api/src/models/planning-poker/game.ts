import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Round } from './round';

export class Game {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = -1;

    @IsString()
    @Expose({ name: 'roomId' })
    @Transform(({ value, obj }) => value ?? obj.room_id, { toClassOnly: true })
        roomId: string = '';

    @IsString()
    @Expose({ name: 'name' })
        name: string = '';

    @IsBoolean()
    @Expose({ name: 'inProgress' })
    @Transform(({ value, obj }) => value === 1 || value === true || obj.in_progress === 1 || obj.in_progress === true, { toClassOnly: true })
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
