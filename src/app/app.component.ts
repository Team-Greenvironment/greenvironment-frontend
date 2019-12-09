import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { DatasharingService } from './services/datasharing.service';
import { SelfService } from './services/selfservice/self.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(private data: DatasharingService, private selfservice: SelfService) { }

  userInfo: User

  loggedIn : boolean = false;
  userID : number;
  username : string;
  handle : string;
  email : string;
  points : number;
  level : number;

  friendIDs : number[];
  groupIDs : number[];
  chatIDs : number[];

  requestIDs : number[];

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.userInfo = user;
      console.log(this.userInfo);
      this.data.changeChatIDs(user.chatIDs)
    })
    if(this.loggedIn != true){
      this.selfservice.checkIfLoggedIn();
    }
  }

}
