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

  constructor(private data: DatasharingService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.loggedIn = user.loggedIn;
      this.userId = user.userID;
      this.profileUrl = '/profile/' + this.userId;
    })    
  }

}
