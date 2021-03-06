import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {DatasharingService} from 'src/app/services/datasharing.service';
import {Chat} from 'src/app/models/chat';

@Component({
  selector: 'home-chatmanager',
  templateUrl: './chatmanager.component.html',
  styleUrls: ['./chatmanager.component.sass']
})
export class ChatmanagerComponent implements OnInit {

  showChatlist = true;
  showChat = false;
  showCreateNewChat = false;

  parentSelectedChat: Chat;
  parentChats: Array<Chat>;

  constructor(private data: DatasharingService, private chatService: ChatService) {
  }

  ngOnInit() {
    /*this.data.currentChatIDs.subscribe(chatIDs => {
      this.parentChatIds = chatIDs
    })*/
    this.refresh();
  }

  goBackToChatlist($event) {
    this.showChatlist = $event;
    this.showChat = false;
    this.showCreateNewChat = false;

    this.refresh();
  }

  showSpecialChat($event) {
    this.parentSelectedChat = $event;
    this.showChatlist = false;
    this.showChat = true;
    this.showCreateNewChat = false;
  }

  showNewChat($event) {
    this.showChatlist = false;
    this.showChat = false;
    this.showCreateNewChat = $event;
  }

  refresh() {
    this.chatService.getAllChatsRaw()
      .subscribe(response => {
        this.parentChats = this.chatService.renderAllChats(response.json());
      });
  }

}
