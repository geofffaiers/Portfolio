import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDecimal, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Vote } from './vote';

export class Round {
    @IsString()
    @Expose({ name: 'roomId' })
    @Transform(({ value, obj }) => value ?? obj.room_id, { toClassOnly: true })
        roomId: string = '';

    @IsNumber()
    @Expose({ name: 'id' })
        id: number = -1;

    @IsNumber()
    @Expose({ name: 'gameId' })
    @Transform(({ value, obj }) => value ?? obj.game_id, { toClassOnly: true })
        gameId: number = -1;

    @IsBoolean()
    @Expose({ name: 'inProgress' })
    @Transform(({ value, obj }) => value === 1 || value === true || obj.in_progress === 1 || obj.in_progress === true, { toClassOnly: true })
        inProgress: boolean = false;

    @IsBoolean()
    @Expose({ name: 'roundSuccess' })
    @Transform(({ value, obj }) => value === 1 || value === true || obj.round_success === 1 || obj.round_success === true, { toClassOnly: true })
        roundSuccess: boolean = false;

    @IsDecimal()
    @Expose({ name: 'totalScore' })
    @Transform(({ value, obj }) => value ?? obj.total_score, { toClassOnly: true })
        totalScore: number = 0;

    @IsDecimal()
    @Expose({ name: 'medianScore' })
    @Transform(({ value, obj }) => value ?? obj.median_score, { toClassOnly: true })
        medianScore: number = 0;

    @IsDecimal()
    @Expose({ name: 'meanScore' })
    @Transform(({ value, obj }) => value ?? obj.mean_score, { toClassOnly: true })
        meanScore: number = 0;

    @IsDecimal()
    @Expose({ name: 'modeScore' })
    @Transform(({ value, obj }) => value ?? obj.mode_score, { toClassOnly: true })
        modeScore: number = 0;

    @IsDecimal()
    @Expose({ name: 'lowestScore' })
    @Transform(({ value, obj }) => value ?? obj.lowest_score, { toClassOnly: true })
        lowestScore: number = 0;

    @IsDecimal()
    @Expose({ name: 'highestScore' })
    @Transform(({ value, obj }) => value ?? obj.highest_score, { toClassOnly: true })
        highestScore: number = 0;

    @IsNumber()
    @Expose({ name: 'countOfDifferentScores' })
    @Transform(({ value, obj }) => value ?? obj.count_of_different_scores, { toClassOnly: true })
        countOfDifferentScores: number = 0;

    @IsOptional()
    @IsDecimal()
    @Expose({ name: 'finalEstimate' })
    @Transform(({ value, obj }) => value ?? obj.final_estimate, { toClassOnly: true })
        finalEstimate?: number;

    @IsOptional()
    @IsDate()
    @Expose({ name: 'endedAt' })
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.ended_at, { toClassOnly: true })
        endedAt?: Date;

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
    @Expose({ name: 'votes' })
    @ValidateNested({ each: true })
    @Type(() => Vote)
        votes: Vote[] = [];
}
