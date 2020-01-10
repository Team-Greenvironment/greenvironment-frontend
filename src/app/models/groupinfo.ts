export class GroupInfo {
    id: number;
    name: string;
    allowedToJoinGroup = false;

    constructor(pId: number, pName: string) {
        this.id = pId;
        this.name = pName;
    }
}
