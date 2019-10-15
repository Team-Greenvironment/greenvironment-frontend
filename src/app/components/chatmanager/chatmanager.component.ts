import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service'
import { ChatComponent } from '../chat/chat.component';
import { Chatinfo } from 'src/app/models/chatinfo';

@Component({
  selector: 'home-chatmanager',
  templateUrl: './chatmanager.component.html',
  styleUrls: ['./chatmanager.component.sass']
})
export class ChatmanagerComponent implements OnInit {

  showChatlist: boolean = true
  showChat: boolean = false
  parentSelectedChat: Chatinfo

  constructor() { }

  ngOnInit() {
  }

  goBackToChatlist($event) {
    this.showChatlist = $event
    this.showChat = false
  }

  showSpecialChat($event) {
    this.parentSelectedChat = $event
    this.showChatlist = false
    this.showChat = true
  }

}
