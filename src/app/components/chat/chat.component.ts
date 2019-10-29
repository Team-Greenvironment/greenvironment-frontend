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

  messages:Array<Chatmessage>

  @Output() goBackEvent = new EventEmitter<boolean>();
  @Input() childChat: Chat;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.refresh()
  }

  goBack() {
    this.goBackEvent.emit(true)
  }

  sendMessage(pElement) {
    this.chatService.sendMessage(this.childChat.id, pElement.value)
    .subscribe(response => {
      console.log("Message sent")
      pElement.value = ""
      this.refresh()
    })
  }

  refresh() {
    this.chatService.getMessagesRaw(this.childChat.id)
    .subscribe(response => 
      {
        console.log("Downloading messages ...")
        this.messages = this.chatService.renderMessages(response.json())
      })
  }

}
