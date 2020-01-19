import {Component, OnInit} from '@angular/core';
import {DatasharingService} from 'src/app/services/datasharing.service';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  loggedIn: boolean;

  constructor(private data: DatasharingService, public media: MediaObserver) {
  }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.loggedIn = user.loggedIn;
    });
  }

}
