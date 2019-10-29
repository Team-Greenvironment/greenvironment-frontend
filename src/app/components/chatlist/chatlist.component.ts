import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chatinfo } from 'src/app/models/chatinfo';
import { Chat } from 'src/app/models/chat';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'chatmanager-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.sass']
})
export class ChatlistComponent implements OnInit {

  @Output() showChatEvent = new EventEmitter<Chat>();
  @Output() showCreateChatEvent = new EventEmitter<boolean>();
  selectedChat: Chat;
  chats: Array<Chat>

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chats = this.chatService.chats
  }

  showNewChat() {
    this.showCreateChatEvent.emit(true)
  }

  showChat(pChat: Chat) {
    this.selectedChat = pChat
    this.showChatEvent.emit(this.selectedChat)
  }


  newChat() {
    console.error("not implemented")
  }
}
