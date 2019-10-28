import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chatinfo } from 'src/app/models/chatinfo';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'chatmanager-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.sass']
})
export class ChatlistComponent implements OnInit {

  chats:Array<Chatinfo> = [new Chatinfo("Max", "23.06.19 12:50"), new Chatinfo("Julius", "17.04.19 16:50"),
  new Chatinfo("David", "23.06.19 12:50"), new Chatinfo("Bruno", "23.06.19 12:50")]

  @Output() showChatEvent = new EventEmitter<Chatinfo>();
  @Output() showCreateChatEvent = new EventEmitter<boolean>();
  selectedChat: Chatinfo;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  showNewChat() {
    this.showCreateChatEvent.emit(true)
  }

  showChat(pChat: Chatinfo) {
    this.selectedChat = pChat
    this.showChatEvent.emit(this.selectedChat)
  }

}
