export class Author {
    id: number
    name: string
    handle: string

    constructor(pId: number, pName: string, pHandle: string) {
        this.id = pId
        this.name = pName
        this.handle = pHandle
    }
}