import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class Vote {
    @IsString()
    @Expose({ name: 'roomId' })
    @Transform(({ value, obj }) => value ?? obj.room_id, { toClassOnly: true })
    roomId: string = '';

    @IsNumber()
    @Expose({ name: 'id' })
        id: number = -1;

    @IsNumber()
    @Expose({ name: 'roundId' })
        roundId: number = -1;

    @IsNumber()
    @Expose({ name: 'userId' })
        userId: number = -1;

    @IsString()
    @IsOptional()
    @Expose({ name: 'value' })
        value?: string;

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
}
