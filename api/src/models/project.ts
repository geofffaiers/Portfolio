import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class Project {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = -1;

    @IsString()
    @Expose({ name: 'name' })
        name: string = '';

    @IsBoolean()
    @Expose({ name: 'isEnabled' })
    @Transform(({ value, obj }) => value === 1 || value === true || obj.is_enabled === 1 || obj.is_enabled === true, { toClassOnly: true })
        isEnabled: boolean = false;

};
