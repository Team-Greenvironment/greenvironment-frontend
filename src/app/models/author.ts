export class Author {
    id: number;
    name: string;
    handle: string;
    profilePicture: string;

    constructor(pId: number, pName: string, pHandle: string, pic: string) {
        this.id = pId;
        this.name = pName;
        this.handle = pHandle;
        this.profilePicture = pic;
    }
}
