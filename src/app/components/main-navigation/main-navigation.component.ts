import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DatasharingService } from '../../services/datasharing.service';
import { SelfService } from '../../services/selfservice/self.service';
import { environment } from 'src/environments/environment';
import { Levellist } from 'src/app/models/levellist';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.sass']
})
export class MainNavigationComponent implements OnInit {
  loggedIn: boolean = false;
  userId: number;
  username: string
  user: User
  levellist: Levellist = new Levellist()
  level: string
  points: number
  profileUrl: string;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private data: DatasharingService,private selfservice: SelfService,private breakpointObserver: BreakpointObserver, private http: Http, private router: Router) {}
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
  navLinksLoggedIn = [
    { path: '', label: 'Home' },
    { path: 'profile/1', label: 'Profile' },
    { path: '/about', label: 'About' },
    { path: '/imprint', label: 'Imprint' },
  ];
  navLinks = [
    { path: '', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/imprint', label: 'Imprint' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
  ];

  logout() {
    let url = environment.graphQLUrl
 
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
