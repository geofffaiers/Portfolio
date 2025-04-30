import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class Session {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = 0;

    @IsOptional()
    @IsNumber()
    @Transform(({ value, obj }) => value ?? obj.user_id, { toClassOnly: true })
    @Expose({ name: 'userId' })
        userId?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value, obj }) => value ?? obj.refresh_token, { toClassOnly: true })
    @Expose({ name: 'refreshToken' })
        refreshToken?: string;

    @IsString()
    @Transform(({ value, obj }) => value ?? obj.user_agent, { toClassOnly: true })
    @Expose({ name: 'userAgent' })
        userAgent: string = '';

    @IsString()
    @Transform(({ value, obj }) => value ?? obj.ip_address, { toClassOnly: true })
    @Expose({ name: 'ipAddress' })
        ipAddress: string = '';

    @IsOptional()
    @IsString()
    @Transform(({ value, obj }) => value ?? obj.location, { toClassOnly: true })
    @Expose({ name: 'location' })
        location?: string;

    @IsBoolean()
    @Transform(({ value, obj }) => value === 1 || value === true || obj.is_active === 1 || obj.is_active === true, { toClassOnly: true })
    @Expose({ name: 'isActive' })
        isActive: boolean = false;

    @IsBoolean()
    @Expose({ name: 'thisSession' })
        thisSession: boolean = false;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.created_at, { toClassOnly: true })
    @Expose({ name: 'createdAt' })
        createdAt?: Date = new Date();

    @IsDate()
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.updated_at, { toClassOnly: true })
    @Expose({ name: 'updatedAt' })
        updatedAt?: Date = new Date();

    @IsDate()
    @Type(() => Date)
    @Transform(({ value, obj }) => value ?? obj.expires_at, { toClassOnly: true })
    @Expose({ name: 'expiresAt' })
        expiresAt?: Date = new Date();

}
