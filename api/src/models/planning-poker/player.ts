import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { User } from '../user';

export class Player {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = 0;

    @IsString()
    @Expose({ name: 'roomId' })
    @Transform(({ value, obj }) => value ?? obj.room_id, { toClassOnly: true })
        roomId: string = '';

    @IsBoolean()
    @Transform(({ value, obj }) => value === 1 || value === true || obj.online === 1 || obj.online === true, { toClassOnly: true })
    @Expose({ name: 'online' })
        online: boolean = false;

    @IsString()
    @Expose({ name: 'role' })
        role: 'owner' | 'player' | 'observer' = 'player';

    @Type(() => User)
    @ValidateNested()
    @Expose({ name: 'user' })
        user: User | null = null;

    @IsOptional()
    @IsString()
    @Expose({ name: 'guestName' })
    @Transform(({ value, obj }) => value ?? obj.guest_name, { toClassOnly: true })
        guestName?: string;

    @IsOptional()
    @IsString()
    @Expose({ name: 'guestSessionId' })
    @Transform(({ value, obj }) => value ?? obj.guest_session_id, { toClassOnly: true })
        guestSessionId?: string;

}
