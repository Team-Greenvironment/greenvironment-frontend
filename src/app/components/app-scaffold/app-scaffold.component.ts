import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DatasharingService } from '../../services/datasharing.service';
import { SelfService } from '../../services/selfservice/self.service';

@Component({
  selector: 'app-scaffold',
  templateUrl: './app-scaffold.component.html',
  styleUrls: ['./app-scaffold.component.sass']
})

export class AppScaffoldComponent implements OnInit {
  loggedIn: boolean = false;
  userId: number;
  profileUrl: string;

  constructor(private data: DatasharingService,private selfservice: SelfService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.loggedIn = user.loggedIn;
      this.userId = user.userID;
      this.profileUrl = '/profile/' + this.userId;
      console.log(user.loggedIn);
    })
    if(this.loggedIn != true){
      console.log('user is not logged in');
      this.selfservice.checkIfLoggedIn;
    };
    console.log('loggedIn is ' + this.loggedIn)
  }

}
