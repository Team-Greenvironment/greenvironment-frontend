export class Chatmessage {
    content: string;
    myself: boolean;

    constructor(pContent: string, pMyself: boolean) {
        this.content = pContent
        this.myself = pMyself
    }
}