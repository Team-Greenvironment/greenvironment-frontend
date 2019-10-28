import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Chatmessage } from 'src/app/models/chatmessage';
import { Chatinfo } from 'src/app/models/chatinfo';

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
  @Input() childChat: Chatinfo;

  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.goBackEvent.emit(true)
  }

}
