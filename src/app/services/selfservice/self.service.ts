import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';
import { User } from 'src/app/models/user';
import { DatasharingService } from '../datasharing.service';
import { userInfo } from 'os';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelfService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) { }

  public checkIfLoggedIn() {
    console.log('check if logged in...');

    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, this.buildJson())
      .subscribe(response => {
        console.log(response.text());
        this.stillLoggedIn();
        this.updateUserInfo(response.json());
      }, error => {
        this.notLoggedIn();
        console.log(error.text());
      }
      );
  }
  public stillLoggedIn() {
    console.log('user was logged in');
  }

  public notLoggedIn() {
    console.log('user was not logged in');
  }

  public updateUserInfo(response: any) {
    const user: User = new User();
    user.loggedIn = true;
    user.userID = response.data.getSelf.id;
    user.username = response.data.getSelf.name;
    user.handle = response.data.getSelf.handle;
    user.email = response.data.getSelf.email;
    user.points = response.data.getSelf.points;
    user.level = response.data.getSelf.level;
    user.friendIDs = response.data.getSelf.friends;
    user.groupIDs = response.data.getSelf.groups;
    user.chatIDs = response.data.getSelf.chats;
    user.requestIDs = response.data.getSelf.requests;

    this.data.changeUserInfo(user);
  }

  public buildJson(): any {
    const body =  {query: `{
      getSelf{id, name,email, handle, points, level, friends{id}, groups{id},chats{id}}
    }`, variables: {
      }};
    return body;
  }
}// add ,receivedRequests{id} later
