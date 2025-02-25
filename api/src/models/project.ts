import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class Project {
    @IsNumber()
    @Expose({ name: 'id' })
    id: number = -1;

    @IsString()
    @Expose({ name: 'name' })
    name: string = '';

    @IsBoolean()
    @Expose({ name: 'isEnabled' })
    isEnabled: boolean = false;

};
