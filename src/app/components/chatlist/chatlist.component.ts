import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chatinfo } from 'src/app/models/chatinfo';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Chat } from 'src/app/models/chat';

@Component({
  selector: 'chatmanager-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.sass']
})
export class ChatlistComponent implements OnInit {

  @Output() showChatEvent = new EventEmitter<Chat>();
  @Output() showCreateChatEvent = new EventEmitter<boolean>();
  selectedChat: Chat;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    
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
