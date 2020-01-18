import {Injectable} from '@angular/core';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {FriendRequest} from 'src/app/models/friendRequest';
import {FriendInfo} from 'src/app/models/friendinfo';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {BaseService} from '../base.service';

const getSelfGraphqlQuery = `{
  getSelf{
    id,
    name,
    email,
    handle,
    points,
    level,
    profilePicture,
    receivedRequests{id, sender{name, handle, id}},
    sentRequests{receiver{id}},
    friends {
     id,
     name,
     level,
     profilePicture,
    },
    groups {
      id,
      name
    },
    chats{
      id
    },
    settings
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class SelfService extends BaseService {

  constructor(private http: HttpClient, private data: DatasharingService) {
    super();
  }

  /**
   * Builds the getself request body
   */
  private static buildGetSelfBody(): any {
    return {
      query: getSelfGraphqlQuery, variables: {}
    };
  }

  /**
   * Checks if the user is still logged in
   */
  public checkIfLoggedIn() {
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, SelfService.buildGetSelfBody(), {headers: this.headers})
      .pipe(tap(response => {
        this.stillLoggedIn();
        this.updateUserInfo(response);
      }, error => {
        this.notLoggedIn();
      }));
  }

  public stillLoggedIn() {
  }

  public notLoggedIn() {
  }

  /**
   * Updates the info on a user
   * @param response
   */
  public updateUserInfo(response: any) {
    const user = new User();
    user.assignFromResponse(response.data.getSelf);
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
    user.friends.push(new FriendInfo(1, 'Freund77', 4, 'lalala'));

    friendRequest = new FriendRequest();
    friendRequest.id = 10;
    friendRequest.senderUserID = 99;
    friendRequest.senderUsername = 'Löwe';
    friendRequest.senderHandle = 'loewe123';
    user.receivedRequests.push(friendRequest);

    this.data.changeUserInfo(user);
  }
}
