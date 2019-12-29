import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';
import { User } from 'src/app/models/user';
import { DatasharingService } from '../datasharing.service';
import { userInfo } from 'os';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { FriendRequest } from 'src/app/models/friendRequest';
import { FriendInfo } from 'src/app/models/friendinfo';

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
        // this.fakeLogin();
        // console.log('user wurde übergeben');
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
    let friendRequest: FriendRequest = new FriendRequest();
    user.loggedIn = true;
    user.userID = response.data.getSelf.id;
    user.username = response.data.getSelf.name;
    user.handle = response.data.getSelf.handle;
    user.email = response.data.getSelf.email;
    user.points = response.data.getSelf.points;
    user.level = response.data.getSelf.level;
    for (const friend of response.data.getSelf.friends) {
      user.friends.push(new FriendInfo(friend.id, friend.name, friend.level));
    }
    user.groupIDs = response.data.getSelf.groups;
    user.chatIDs = response.data.getSelf.chats;
    for (const request of response.data.getSelf.sentRequests) {
      user.sentRequestUserIDs.push(request.receiver.id);
    }
    for (const request of response.data.getSelf.receivedRequests) {
      friendRequest = new FriendRequest();
      friendRequest.id = request.id;
      friendRequest.senderUserID = request.sender.id;
      friendRequest.senderUsername = request.sender.name;
      friendRequest.senderHandle = request.sender.handle;
      user.receivedRequests.push(friendRequest);
    }
    this.data.changeUserInfo(user);
  }
  public fakeLogin() {
    const user: User = new User();
    let friendRequest: FriendRequest = new FriendRequest();
    user.loggedIn = true;
    user.userID = 1;
    user.username = 'Rapier';
    user.handle = 'rapier123';
    user.email = 'r@r.com';
    user.points = 100;
    user.level = 3;
    user.friends.push(new FriendInfo(1, 'Freund77', 4));

    friendRequest = new FriendRequest();
    friendRequest.id = 10;
    friendRequest.senderUserID = 99;
    friendRequest.senderUsername = 'Löwe';
    friendRequest.senderHandle = 'loewe123';
    user.receivedRequests.push(friendRequest);

    this.data.changeUserInfo(user);
  }

  public buildJson(): any {
    const body =  {query: `{
      getSelf{
        id,
        name,
        email,
        handle,
        points,
        level,
        receivedRequests{id, sender{name, handle, id}},
        sentRequests{receiver{id}},
        friends {
         id,
         name,
         level
        },
        groups {
          id
        },
        chats{
          id
        }
      }
    }`, variables: {
      }};
    return body;
  }
}// add ,receivedRequests{id} later
