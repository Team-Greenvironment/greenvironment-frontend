import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Chat} from 'src/app/models/chat';
import {Chatmessage} from 'src/app/models/chatmessage';
import {FriendInfo} from 'src/app/models/friendinfo';
import {DatasharingService} from '../datasharing.service';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  arr: number[];
  ownID: number;
  chats: Array<Chat> = [];

  constructor(private http: Http, private data: DatasharingService) {
    this.data.currentUser.subscribe(user => {
      this.ownID = user.userID;
    });
  }

  public getAllChats(): Array<Chat> {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.getBodyForGetAllChats())
      .subscribe(response => {
        this.chats = this.renderAllChats(response.json());
      });
    return this.chats;
  }

  public getAllChatsRaw(): any {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, this.getBodyForGetAllChats());
  }

  public getChatsByID(pChatIDs: number[]): Array<Chat> {
    this.chats = [];

    for (const chatId of pChatIDs) {
      const url = environment.graphQLUrl;

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      this.http.post(url, this.getBodyForGetChatsByID(chatId))
        .subscribe(response => {
          this.updateChat(response.json());
        });
    }
    return this.chats;
  }

  public getChatsByIDRaw(pChatIDs: number[]): any {

    for (const chatId of pChatIDs) {
      const url = environment.graphQLUrl;

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      this.http.post(url, this.getBodyForGetChatsByID(chatId))
        .subscribe(response => {
          this.updateChat(response.json());
        });
    }
    return this.chats;
  }

  public createNewChat(pUserID: number) {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.getBodyForNewChat(pUserID));
  }

  /**
   * TODO: Needs to be used somewhere or it will be removed
   */
  public requestAllChatPartners(): Array<FriendInfo> {
    const url = environment.graphQLUrl;
    // tslint:disable-next-line:prefer-const
    let chatPartners: Array<FriendInfo>;
    let temp;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.getBodyForRequestOfAllChatPartners())
      .subscribe(response => {
        temp = response.json();
      });

    for (const chat of temp.data.getSelf.chats) {
      let memberID: number;
      let memberName: string;
      let memberLevel: {name: string, levelNumber: number};
      let profilePicture: string;
      for (const member of chat.members) {
        if (member.id !== this.ownID) {
          memberID = member.id;
          memberName = member.name;
          memberLevel = member.level;
          profilePicture = member.profilePicture;
        }
      }
      chatPartners.push(new FriendInfo(memberID, memberName, memberLevel, profilePicture));
    }

    return chatPartners;
  }

  public sendMessage(pChatID: number, pContent: string): any {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, this.getBodyForSendMessage(pChatID, pContent));
  }

  public getMessages(pChatID): Array<Chatmessage> {
    let messages: Array<Chatmessage>;
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.getBodyForGetMessagesInChat(pChatID)).subscribe(response => {
      messages = this.renderMessages(response.json());
    });
    return messages;
  }

  public getMessagesRaw(pChatID): any {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, this.getBodyForGetMessagesInChat(pChatID));
  }

  public renderMessages(pResponse: any): Array<Chatmessage> {
    const messages = new Array<Chatmessage>();
    for (const message of pResponse.data.getChat.messages) {
      if (message.author.id === this.ownID) {
        messages.push(new Chatmessage(message.content, message.createdAt, true));
      } else {
        messages.push(new Chatmessage(message.content, message.createdAt, false));
      }
    }
    return messages;
  }

  public renderAllChats(pResponse: any): Array<Chat> {
    const chats = Array<Chat>();
    for (const chat of pResponse.data.getSelf.chats) {
      let memberID: number;
      let memberName: string;
      for (const member of chat.members) {
        if (member.id !== this.ownID) {
          memberID = member.id;
          memberName = member.name;
        }
      }
      const messages = new Array<Chatmessage>();
      for (const message of chat.messages) {
        if (message.author.id === this.ownID) {
          messages.push(new Chatmessage(message.content, message.createdAt, true));
        } else {
          messages.push(new Chatmessage(message.content, message.createdAt, false));
        }
      }
      chats.push(new Chat(chat.id, memberID, memberName, messages));
    }
    return chats;
  }

  updateChat(pResponse: any) {
    const id = pResponse.data.getChat.id;
    let memberId: number;
    let memberName: string;
    for (const member of pResponse.data.getChat.members) {
      if (member.id !== this.ownID) {
        memberId = member.id;
        memberName = member.name;
      }
    }
    const messages = new Array<Chatmessage>();
    for (const message of pResponse.data.getChat.messages) {
      if (message.author.id === this.ownID) {
        messages.push(new Chatmessage(message.content, message.createdAt, true));
      } else {
        messages.push(new Chatmessage(message.content, message.createdAt, false));
      }
    }
    this.chats.push(new Chat(id, memberId, memberName, messages));
  }

  getBodyForNewChat(pUserID: number) {
    this.arr = [pUserID];
    const body = {
      query: `mutation($userID: number[]) {
        createChat(members: $userID) {id}
      }`, variables: {
        members: this.arr
      }
    };

    return body;
  }

  getBodyForRequestOfAllChatPartners() {
    const body = {
      query: `query {
        getSelf {
          chats(first: 1000, offset: 0) {members{name, id, level {name levelNumber}}}
        }}`
    };

    return body;
  }

  getBodyForSendMessage(pchatID: number, pContent: string) {
    const body = {
      query: `mutation($chatId: ID!, $content: String!) {
        sendMessage(chatId: $chatId, content: $content) {id}
      }`, variables: {
        chatId: pchatID,
        content: pContent
      }
    };

    return body;
  }

  getBodyForGetAllChats() {
    const body = {
      query: `query {
        getSelf {
          chats(first: 10, offset: 0) {
            id, members{name, id, level {name levelNumber}},
            messages(first: 10, offset: 0) {
              author {id}, createdAt, content
            }
          }
        }
      }`
    };
    return body;
  }

  getBodyForGetChatsByID(pChatID: number) {
    const body = {
      query: `query($chatID: ID!) {
        getChat(chatId: $chatID) {id, members{name, id, level {name levelNumber}},
          messages(first: 1000, offset: 0) {author {id}, createdAt, content}}
        }
      }`, variables: {
        chatId: pChatID
      }
    };
    return body;
  }

  getBodyForGetMessagesInChat(pChatID: number) {
    const body = {
      query: `query($chatId: ID!) {
        getChat(chatId: $chatId) {
          messages(first: 1000, offset: 0) {author {id}, createdAt, content}
        }
      }`, variables: {
        chatId: pChatID
      }
    };
    return body;
  }
}
