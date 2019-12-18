import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendInfo } from 'src/app/models/friendinfo';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'chatmanager-chatcontacts',
  templateUrl: './chatcontacts.component.html',
  styleUrls: ['./chatcontacts.component.sass']
})
export class ChatcontactsComponent implements OnInit {

  @Output() goBackEvent = new EventEmitter<boolean>();
  selectedContact: FriendInfo;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  goBack() {
    this.goBackEvent.emit(true);
  }

  createChat(pFriendInfo: FriendInfo) {
    this.selectedContact = pFriendInfo;
    this.chatService.createNewChat(pFriendInfo.id);
    this.goBack();
  }

  contactList() {
    console.error('Not Imlemented!');
  }

}
