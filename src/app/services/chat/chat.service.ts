import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Chat } from 'src/app/models/chat';
import { responsePathAsArray } from 'graphql';
import { Chatmessage } from 'src/app/models/chatmessage';
import { FriendInfo } from 'src/app/models/friendinfo';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  arr: number[]
  ownID: number
  chats: Array<Chat>

  constructor(private http: Http) { }

  public getAllChats(): Array<Chat> {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetAllChats())
    .subscribe(response => {
        this.chats = this.updateAllChats(response.json())
      });
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
 
    this.http.post(url, this.getBodyForSendMessage(pChatID, pContent))
  }

  updateAllChats(pResponse: any): Array<Chat> {
    let chats: Array<Chat>
    for(let chat of pResponse.data.getSelf.chats) {
      let memberID: number
      let memberName: string
      for(let member of chat.members) {
        if(member.id != this.ownID) {
          memberID = member.id
          memberName = member.name
        }
      }
      let messages: Array<Chatmessage>
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
          chats(first: 1000, offset: 0) {id, members{name, id}, 
          messages(first: 1000, offset: 0) {author {id}, createdAt, content}}
        }
      }`
      }
  }
}
