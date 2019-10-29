import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Chatmessage } from 'src/app/models/chatmessage';
import { Chatinfo } from 'src/app/models/chatinfo';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Chat } from 'src/app/models/chat';

@Component({
  selector: 'chatmanager-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {

  messages:Array<Chatmessage> = [new Chatmessage("Hallo", "01.01.",true), new Chatmessage("Hallo", "01.01.",true), 
  new Chatmessage("Hallo", "01.01.",true), new Chatmessage("Hallo", "01.01.",true), new Chatmessage("Hallo", "01.01.",true), 
  new Chatmessage("Hallo", "01.01.",true)]

  @Output() goBackEvent = new EventEmitter<boolean>();
  @Output() refreshEvent = new EventEmitter<boolean>()
  @Input() childChat: Chat;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  goBack() {
    this.goBackEvent.emit(true)
  }

  sendMessage(pElement) {
    this.chatService.sendMessage(this.childChat.id, pElement.value)
    this.refreshEvent.emit(true)
    pElement.value = ""
  }

}
