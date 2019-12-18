import { Chatmessage } from './chatmessage';

export class Chat {
    id: number;
    memberID: number;
    memberName: string;
    messages: Array<Chatmessage>;


    constructor(pId: number, pMemberID: number, pMemberName: string, pMessages: Array<Chatmessage>) {
        this.id = pId;
        this.memberID = pMemberID;
        this.memberName = pMemberName;
        this.messages = pMessages;
    }
}
