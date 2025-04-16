import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class Session {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = 0;

    @IsOptional()
    @IsString()
    @Expose({ name: 'userId' })
        userId?: string;

    @IsString()
    @Expose({ name: 'userAgent' })
        userAgent: string = '';

    @IsString()
    @Expose({ name: 'ipAddress' })
        ipAddress: string = '';

    @IsOptional()
    @IsString()
    @Expose({ name: 'location' })
        location?: string;

    @IsBoolean()
    @Expose({ name: 'isActive' })
        isActive: boolean = false;

    @IsBoolean()
    @Expose({ name: 'thisSession' })
        thisSession: boolean = false;

    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'createdAt' })
        createdAt?: Date = new Date();

    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'updatedAt' })
        updatedAt?: Date = new Date();

    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'expiresAt' })
        expiresAt?: Date = new Date();

}
