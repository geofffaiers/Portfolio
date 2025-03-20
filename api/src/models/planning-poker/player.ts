import { IsBoolean, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { User } from '../user';

export class Player extends User {
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
}
