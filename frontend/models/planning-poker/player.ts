import { IsBoolean, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { User } from '../user';
import type { Role } from './role';

export class Player extends User {
    @IsString()
    @Expose({ name: 'roomId' })
        roomId: string = '';

    @IsBoolean()
    @Expose({ name: 'online' })
        online: boolean = false;

    @IsString()
    @Expose({ name: 'role' })
        role: Role = 'player';

    constructor (player: Player) {
        super(player);
        if (player == null) {
            return;
        }
        this.roomId = player.roomId;
        this.online = player.online;
        this.role = player.role;
    }
}
