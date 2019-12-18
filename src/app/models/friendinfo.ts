import { Levellist } from 'src/app/models/levellist';

export class FriendInfo {
    levellist: Levellist = new Levellist();
    id: number;
    name: string;
    rankname: string;

    constructor(pId: number, pName: string, pLevel: number) {
        this.id = pId;
        this.name = pName;
        this.rankname = this.levellist.getLevelName(pLevel);
    }
}
