export class GroupInfo {
    id: number
    name: string
    members: number[]

    constructor(pId: number, pName: string, pMembers: number[]) {
        this.id = pId
        this.name = pName
        this.members = pMembers
    }
}