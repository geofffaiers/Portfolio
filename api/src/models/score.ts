import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class Score {
  @IsNumber()
  @Expose({ name: 'id' })
      id: number = 0;

  @IsString()
  @Expose({ name: 'name' })
      name: string = '';

  @IsNumber()
  @Expose({ name: 'score' })
      score: number = 0;

  @IsDate()
  @Expose({ name: 'createdAt' })
  @Type(() => Date)
  @Transform(({ value, obj }) => value ?? obj.created_at, { toClassOnly: true })
      createdAt: Date = new Date();

  @IsNumber()
  @Expose({ name: 'ranking' })
      ranking: number = 0;
}
