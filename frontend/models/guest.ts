import { IsArray, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class Guest {
  @IsArray()
  @IsNumber({}, { each: true })
  @Expose({ name: 'ids' })
      ids: number[] = [];

  @IsString()
  @Expose({ name: 'guestName' })
      guestName: string = '';
}
