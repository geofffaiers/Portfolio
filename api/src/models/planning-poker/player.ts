import { IsBoolean, IsString } from "class-validator";
import { Expose, Transform } from "class-transformer";
import { User } from "../user";

export class Player extends User {
    @IsBoolean()
    @Transform(({ value }) => value === 1 || value === true, { toClassOnly: true })
    @Expose({ name: 'online' })
    online: boolean = false;

    @IsString()
    @Expose({ name: 'role' })
    role: 'owner' | 'player' | 'observer' = 'player';
}