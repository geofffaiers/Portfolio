import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber } from "class-validator";
import { Vote } from "./vote";

export class Round {
    @IsNumber()
    @Expose({ name: 'id' })
    id: number = -1;

    @IsNumber()
    @Expose({ name: 'gameId' })
    gameId: number = -1;

    @IsBoolean()
    @Expose({ name: 'inProgress' })
    inProgress: boolean = false;

    @IsBoolean()
    @Expose({ name: 'roundSuccess' })
    roundSuccess: boolean = false;

    @IsNumber()
    @Expose({ name: 'totalScore' })
    totalScore: number = 0;

    @IsNumber()
    @Expose({ name: 'medianScore' })
    medianScore: number = 0;

    @IsNumber()
    @Expose({ name: 'meanScore' })
    meanScore: number = 0;

    @IsNumber()
    @Expose({ name: 'lowestScore' })
    lowestScore: number = 0;

    @IsNumber()
    @Expose({ name: 'highestScore' })
    highestScore: number = 0;

    @IsNumber()
    @Expose({ name: 'countOfDifferentScores' })
    countOfDifferentScores: number = 0;

    @IsNumber()
    @Expose({ name: 'finalEstimate' })
    finalEstimate?: number;

    @IsDate()
    @Expose({ name: 'endedAt' })
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.ended_at, { toClassOnly: true })
    endedAt: Date = new Date();

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
    votes: Vote[] = [];
}