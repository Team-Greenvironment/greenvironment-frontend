import {Component, OnInit} from '@angular/core';
import {DatasharingService} from './services/datasharing.service';
import {SelfService} from './services/selfservice/self.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(private data: DatasharingService, private selfservice: SelfService) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      if (user.loggedIn !== true) {
        this.selfservice.checkIfLoggedIn().subscribe();
      }
    });
  }

}
