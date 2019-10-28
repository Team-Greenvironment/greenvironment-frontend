import { Author } from "./author"

export class Post {
    id: number
    content: string
    date: string
    upvotes: number
    downvotes: number
    author: Author

    constructor(pId: number, pContent: string, pUpvotes: number, pDownvotes: number, pDate: string, pAuthor: Author) {
        this.id = pId
        this.content = pContent
        this.upvotes = pUpvotes
        this.downvotes = pDownvotes
        this.date = pDate
        this.author = pAuthor
    }
}