import { IsBoolean, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { User } from "../user";

export class Player extends User {
    @IsBoolean()
    @Expose({ name: 'online' })
    online: boolean = false;

    @IsString()
    @Expose({ name: 'role' })
    role: 'owner' | 'player' | 'observer' = 'player';
}
