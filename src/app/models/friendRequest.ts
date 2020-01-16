import { User } from 'src/app/models/user';

export class FriendRequest {
    id: number;
    senderUserID: number;
    senderHandle: string;
    senderUsername: string;

    constructor(id?: number, senderUserId?: number, senderHandle?: string, senderName?: string) {
        this.id = id;
        this.senderUserID = senderUserId;
        this.senderHandle = senderHandle;
        this.senderUsername = senderName;
    }
  }
