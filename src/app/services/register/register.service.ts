import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Registration } from '../../models/registration';
import {Router} from '@angular/router';
import { DatasharingService } from '../datasharing.service';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { FriendRequest } from 'src/app/models/friendRequest';
import { FriendInfo } from 'src/app/models/friendinfo';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) { }

  public register(registration: Registration, errorCb: any) {

    // let url = './graphql'
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, this.buildJson(registration))
      .subscribe(response => {
        console.log(response.text());
        this.registerSuccess();
        this.updateUserInfo(response.json());
      }, errorCb
      );
  }

  public registerSuccess() {
    console.log('alles supi dupi');
    // do routing
    this.router.navigateByUrl('');
  }

  public updateUserInfo(response: any) {
    const user: User = new User();
    let friendRequest: FriendRequest = new FriendRequest();
    user.loggedIn = true;
    user.userID = response.data.register.id;
    user.username = response.data.register.name;
    user.handle = response.data.register.handle;
    user.email = response.data.register.email;
    user.points = response.data.register.points;
    user.level = response.data.register.level;
    for (const friend of response.data.register.friends) {
      user.friends.push(new FriendInfo(friend.id, friend.name, friend.level));
    }
    user.groupIDs = response.data.register.groups;
    user.chatIDs = response.data.register.chats;
    for (const request of response.data.register.sentRequests) {
      user.sentRequestUserIDs.push(request.receiver.id);
    }
    for (const request of response.data.register.receivedRequests) {
      friendRequest = new FriendRequest();
      friendRequest.id = request.id;
      friendRequest.senderUserID = request.sender.id;
      friendRequest.senderUsername = request.sender.name;
      friendRequest.senderHandle = request.sender.handle;
      user.receivedRequests.push(friendRequest);
    }
    if (JSON.parse(response.data.register.settings).darkmode === 'true') {
      user.darkmode = true;
    }
    this.data.changeUserInfo(user);

  }

  public buildJson(registration: Registration): any {
    const body =  {query: `mutation($username: String, $email: String, $pwHash: String) {
      register(username: $username, email: $email, passwordHash: $pwHash) {
        id,
        name,
        handle,
        points,
        level,
        receivedRequests{id, sender{name, handle, id}},
        sentRequests{receiver{id}}
        friends {
          id,
          name,
          level
         },
        groups{id},
        chats{id},
        settings
       }
    }`, variables: {
        email: registration.email,
        pwHash: registration.passwordHash,
        username: registration.username,
      }};
    return body;
  }
}

