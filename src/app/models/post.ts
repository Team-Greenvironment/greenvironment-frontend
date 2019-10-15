export class Post {
    id: string
    username: string
    handle: string
    message: string
    date: string
    votes: number

    constructor(pId: string, pUsername: string, pHandle: string, pMessage: string, pDate: string, pVotes: number) {
        this.id = pId
        this.username = pUsername
        this.handle = pHandle
        this.message = pMessage
        this.date = pDate
        this.votes = pVotes
    }
}