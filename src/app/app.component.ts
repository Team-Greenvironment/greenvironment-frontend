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

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      if (user.loggedIn !== true) {
        this.selfservice.checkIfLoggedIn().subscribe();
      }
    });
  }

}
