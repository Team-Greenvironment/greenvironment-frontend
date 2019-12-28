import {Injectable} from '@angular/core';
import {Headers, Http, Request} from '@angular/http';
import {Login} from '../../models/login';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { FriendRequest } from 'src/app/models/friendRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  public login(login: Login, errorCb: any) {

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(environment.graphQLUrl, this.buildJson(login))
      .subscribe(response => {
          console.log(response.text());
          this.loginSuccess();
          this.updateUserInfo(response.json());
        }, errorCb
      );
  }

  public loginSuccess() {
    console.log('alles supi dupi');
    this.router.navigateByUrl('');
  }

  public updateUserInfo(response: any) {
    const user: User = new User();
    let friendRequest: FriendRequest = new FriendRequest();
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
    for (const request of response.data.login.sentRequests) {
      user.sentRequestUserIDs.push(request.receiver.id);
    }
    for (const request of response.data.login.receivedRequests) {
      friendRequest = new FriendRequest();
      friendRequest.id = request.id;
      friendRequest.senderUserID = request.sender.id;
      friendRequest.senderUsername = request.sender.name;
      friendRequest.senderHandle = request.sender.handle;
      user.receivedRequests.push(friendRequest);
    }
    console.log(user.receivedRequests);
    this.data.changeUserInfo(user);
  }

  public buildJson(login: Login): any {
    const body = {
      query: `mutation($email: String!, $pwHash: String!) {
        login(email: $email, passwordHash: $pwHash) {
          id,
          name,
          email,
          handle,
          points,
          level,
          receivedRequests{id, sender{name, handle, id}},
          sentRequests{receiver{id}},
          friends {
           id
          },
          groups {
            id
          },
          chats{
            id
          }
        }
      }`
      , variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }
    };
    return body;
  }
}
