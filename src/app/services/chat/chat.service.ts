import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Chat } from 'src/app/models/chat';
import { responsePathAsArray } from 'graphql';
import { Chatmessage } from 'src/app/models/chatmessage';
import { FriendInfo } from 'src/app/models/friendinfo';
import { DatasharingService } from '../datasharing.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  arr: number[]
  ownID: number
  chats: Array<Chat> = []

  constructor(private http: Http, private data: DatasharingService) {
    this.data.currentUserInfo.subscribe(user => {
      this.ownID = user.userID})
   }

  public getAllChats(): Array<Chat> {
    console.log("Getting all chats ..")
    let url = environment.graphQLUrl
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetAllChats())
    .subscribe(response => {
        this.chats = this.renderAllChats(response.json())
      });
    return this.chats
  }

  public getAllChatsRaw(): any {
    console.log("Getting all chats ..")
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    return this.http.post(url, this.getBodyForGetAllChats())
  }

  public getChatsByID(pChatIDs: number[]): Array<Chat> {
    this.chats = []
    console.log("Getting chats by ID..")

    for(let chatId of pChatIDs) {
      let url = 'https://greenvironment.net/graphql'
  
      let headers = new Headers()
      headers.set('Content-Type', 'application/json')

      this.http.post(url, this.getBodyForGetChatsByID(chatId))
      .subscribe(response => {
        this.updateChat(response.json())
      })
    }
    return this.chats
  }

  public getChatsByIDRaw(pChatIDs: number[]): any {
    console.log("Getting chats by ID..")

    for(let chatId of pChatIDs) {
      let url = 'https://greenvironment.net/graphql'
  
      let headers = new Headers()
      headers.set('Content-Type', 'application/json')

      this.http.post(url, this.getBodyForGetChatsByID(chatId))
      .subscribe(response => {
        this.updateChat(response.json())
      })
    }
    return this.chats
  }

  public createNewChat(pUserID: number) {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForNewChat(pUserID))
  }

  public requestAllChatPartners(): Array<FriendInfo> {
    let url = 'https://greenvironment.net/graphql'
    let chatPartners: Array<FriendInfo>
    let temp
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForRequestOfAllChatPartners())
    .subscribe(response => {
      temp = response.json()
    })

    for(let chat of temp.data.getSelf.chats) {
      let memberID: number
      let memberName: string
      for(let member of chat.members) {
        if(member.id != this.ownID) {
          memberID = member.id
          memberName = member.name
        }
      }
      chatPartners.push(new FriendInfo(memberID, memberName))
    }

    return chatPartners
  }

  public sendMessage(pChatID: number, pContent: string) {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForSendMessage(pChatID, pContent)).subscribe(response => console.log("Message sent"))
  }

  public getMessages(pChatID): Array<Chatmessage> {
    let messages: Array<Chatmessage>
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetMessagesInChat(pChatID)).subscribe(response => 
      {
        console.log("Downloading messages ...")
        messages = this.renderMessages(response.json())
      })
    return messages
  }

  public getMessagesRaw(pChatID): any {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    return this.http.post(url, this.getBodyForGetMessagesInChat(pChatID))
  }

  public renderMessages(pResponse: any): Array<Chatmessage> {
    let messages = new Array<Chatmessage>()
      for(let message of pResponse.data.getChat.messages) {
        if(message.author.id == this.ownID) {
          messages.push(new Chatmessage(message.content, message.createdAt, true))
        } else {
          messages.push(new Chatmessage(message.content, message.createdAt, false))
        }
      }
    return messages
  }

  public renderAllChats(pResponse: any): Array<Chat> {
    let chats = Array<Chat>()
    for(let chat of pResponse.data.getSelf.chats) {
      let memberID: number
      let memberName: string
      for(let member of chat.members) {
        if(member.id != this.ownID) {
          memberID = member.id
          memberName = member.name
        }
      }
      let messages = new Array<Chatmessage>()
      for(let message of chat.messages) {
        if(message.author.id == this.ownID) {
          messages.push(new Chatmessage(message.content, message.createdAt, true))
        } else {
          messages.push(new Chatmessage(message.content, message.createdAt, false))
        }
      }
      chats.push(new Chat(chat.id, memberID, memberName, messages))
    }
    return chats
  }

  updateChat(pResponse: any) {
    let id = pResponse.data.getChat.id
    let memberId : number
    let memberName: string
    for(let member of pResponse.data.getChat.members) {
      if(member.id != this.ownID) {
        memberId = member.id
        memberName = member.name
      }
    }
    let messages = new Array<Chatmessage>()
    for(let message of pResponse.data.getChat.messages) {
      if(message.author.id == this.ownID) {
        messages.push(new Chatmessage(message.content, message.createdAt, true))
      } else {
        messages.push(new Chatmessage(message.content, message.createdAt, false))
      }
    }
    this.chats.push(new Chat(id, memberId, memberName, messages))
  }

  getBodyForNewChat(pUserID: number) {
    this.arr = [pUserID]
    const body =  {query: `mutation($userID: number[]) {
        createChat(members: $userID) {id} 
      }`, variables: {
          members: this.arr
      }};

      return body
  }

  getBodyForRequestOfAllChatPartners() {
    const body =  {query: `query {
        getSelf {
          chats(first: 1000, offset: 0) {members{name, id}}
        }}`
      }

      return body
  }

  getBodyForSendMessage(pchatID: number, pContent: string) {
    const body =  {query: `mutation($chatID: number, $content: string) {
        sendMessage(chatId: $chatID, content: $content) {id} 
      }`, variables: {
          chatId: pchatID,
          content: pContent
      }};

      return body
  }

  getBodyForGetAllChats() {
    const body =  {query: `query {
        getSelf {
          chats(first: 1000, offset: 0) {
            id, members{name, id}, 
            messages(first: 1000, offset: 0) {
              author {id}, createdAt, content
            }
          }
        }
      }`
      }
    return body
  }

  getBodyForGetChatsByID(pChatID: number) {
    const body =  {query: `query($chatID: ID!) {
        getChat(chatId: $chatID) {id, members{name, id}, 
          messages(first: 1000, offset: 0) {author {id}, createdAt, content}}
        }
      }`, variables: {
          chatId: pChatID
      }}
    return body
  }

  getBodyForGetMessagesInChat(pChatID: number) {
    const body =  {query: `query($chatID: ID!) {
        getChat(chatId: $chatID) {
          messages(first: 1000, offset: 0) {author {id}, createdAt, content}
        }
      }`, variables: {
          chatId: pChatID
      }}
    return body
  }
}
