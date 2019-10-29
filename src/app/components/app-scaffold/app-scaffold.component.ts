import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DatasharingService } from '../../services/datasharing.service';
import { SelfService } from '../../services/selfservice/self.service';
import { Levellist } from 'src/app/models/levellist';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-scaffold',
  templateUrl: './app-scaffold.component.html',
  styleUrls: ['./app-scaffold.component.sass']
})

export class AppScaffoldComponent implements OnInit {
  loggedIn: boolean = false;
  userId: number;
  username: string
  user: User
  levellist: Levellist = new Levellist()
  level: string
  points: number
  profileUrl: string;

  dropdownShown: boolean = false
  constructor(private data: DatasharingService) { }

  constructor(private data: DatasharingService,private selfservice: SelfService, private http: Http, private router: Router) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user
      this.loggedIn = user.loggedIn;
      this.userId = user.userID;
      this.username = user.username
      this.level = this.levellist.getLevelName(user.level)
      this.points = user.points
      this.profileUrl = '/profile/' + this.userId;
    })    
  }

  showDropdown() {
    if(!this.dropdownShown) {
      this.dropdownShown = true
    }
    else {
      this.dropdownShown = false
    }
  }

  logout() {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation {
        logout
      }`}
 
    this.http.post(url, body).subscribe(response => {
        console.log(response.text())})
    this.loggedIn = false
    let user = new User()
    user.loggedIn = false
    this.data.changeUserInfo(user)
    this.router.navigate(['login'])
  }

}
