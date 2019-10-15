import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Chatmessage } from 'src/app/models/chatmessage';
import { Chatinfo } from 'src/app/models/chatinfo';

@Component({
  selector: 'chatmanager-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {

  messages:Array<Chatmessage> = [new Chatmessage("Hallo",true), new Chatmessage("Hallo",false), 
  new Chatmessage("Hallo",true), new Chatmessage("Hallo",false), new Chatmessage("Hallo",true), 
  new Chatmessage("Hallo",false)]

  @Output() goBackEvent = new EventEmitter<boolean>();
  @Input() childChat: Chatinfo;

  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.goBackEvent.emit(true)
  }

}
