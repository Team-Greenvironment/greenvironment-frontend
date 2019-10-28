import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';
import { User } from 'src/app/models/user';
import { DatasharingService } from '../datasharing.service';
import { userInfo } from 'os';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SelfService {

  constructor(private http: Http, private data: DatasharingService,private router: Router) { }

  public checkIfLoggedIn() {
    console.log('check if logged in...');
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson())
      .subscribe(response => {
        console.log(response.text());
        this.stillLoggedIn();
        this.updateUserInfo(response.json())
      }, error => {
        this.notLoggedIn()
        console.log(error.text())
      }
      );
  }
  public stillLoggedIn(){
    console.log('user was logged in');
  }

  public notLoggedIn(){
    console.log('user was not logged in');
    //do routing
    this.router.navigateByUrl('/login');
  }

  public updateUserInfo(response : any){
    const user: User = new User();
    user.loggedIn = true;
    user.userID = response.data.login.id;
    user.username = response.data.login.name;
    user.handle = response.data.login.handle;
    user.email = response.data.login.email;
    user.points = response.data.login.points;
    user.level = response.data.login.level;
    user.friendIDs = response.data.login.friends;
    user.groupIDs = response.data.login.groups;
    user.chatIDs = response.data.login.chats;
    user.requestIDs = response.data.login.requests;

    this.data.changeUserInfo(user)
  }

  public buildJson(): any {
    const body =  {query: `query() {
      getSelf(){id, name, handle, points, level, friends{id}, groups{id},chats{id}} 
    }`, variables: {
      }};
    return body;
  }
}//add ,receivedRequests{id} later
