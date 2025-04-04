import { Player } from '@/models';

export class PlayerWrapper extends Player {
    updated: boolean;
    removed: boolean;

    constructor(player: Player, updated: boolean, removed: boolean) {
        super(player);
        this.updated = updated;
        this.removed = removed;
    }
}
