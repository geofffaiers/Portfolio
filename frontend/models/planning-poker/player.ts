import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { User } from '../user';
import type { Role } from './role';

export class Player {
    @IsNumber()
    @Expose({ name: 'id' })
        id: number = -1;

    @IsString()
    @Expose({ name: 'roomId' })
        roomId: string = '';

    @IsBoolean()
    @Expose({ name: 'online' })
        online: boolean = false;

    @IsString()
    @Expose({ name: 'role' })
        role: Role = 'player';

    @Type(() => User)
    @ValidateNested()
    @Expose({ name: 'user' })
        user: User | null = null;

    @IsOptional()
    @IsString()
    @Expose({ name: 'guestName' })
        guestName?: string;

    constructor(player: Player) {
        if (player == null) {
            return;
        }
        this.id = player.id;
        this.roomId = player.roomId;
        this.online = player.online;
        this.role = player.role;
        this.role = player.role;
        this.user = player.user;
        this.guestName = player.guestName;
    }
}
