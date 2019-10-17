import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'app-scaffold',
  templateUrl: './app-scaffold.component.html',
  styleUrls: ['./app-scaffold.component.sass']
})

export class AppScaffoldComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(private data: DatasharingService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.loggedIn = user.loggedIn;
      console.log('he´s comming through!');
    })
  }

}
