import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { GroupInfo } from 'src/app/models/groupinfo';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  public isAllowedToSendRequest(userID: number, self: User): boolean {
    if (!self.loggedIn) { return false; } else {
      for (const receiverID of self.sentRequestUserIDs) {
        if (userID === receiverID ||
          userID === self.userID) {
          return false;
        }
      }
      for (const friend of self.friends) {
        if (userID === friend.id) {
          return false;
        }
      }
      for (const sender of self.receivedRequests) {
        if (userID === sender.senderUserID) {
          return false;
        }
      }
    }
    return true;
  }

  public isAllowedToJoinGroup(groupId: number, self: User): boolean {
    // returns false if user is not logged in or is member of the group(Id)
    if (!self.loggedIn) {
      return false;
    }
    for (const group of self.groups) {
      if (group.id === groupId) {
        return false;
      }
    }
    return true;
  }

  public sendFriendRequest(user: User) {
    this.data.addSentRequestUserID(user.userID);
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.buildJsonRequest(user.userID, 'FRIENDREQUEST'))
      .subscribe(response => {
      });
  }

  public joinGroup(group: GroupInfo) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.buildJsonJoinGroup(group.id))
      .subscribe(response => {
      });
  }

  public buildJsonRequest(id_: number, type_: String): any {
    const body = {
      query: `mutation($id: ID!, $type: RequestType) {
        sendRequest(receiver: $id, type: $type) {
          id
        }
      }`
      , variables: {
        id: id_,
        type: type_
      }
    };
    return body;
  }

  public buildJsonJoinGroup(id_: number): any {
    const body = {
      query: `mutation($id: ID!) {
        joinGroup(id: $id) {
          id
        }
      }`
      , variables: {
        id: id_
      }
    };
    return body;
  }

  public buildJsonAcceptRequest(id_: number): any {
    const body = {
      query: `mutation($id: ID!) {
        acceptRequest(sender: $id, type: FRIENDREQUEST)
      }`
      , variables: {
        id: id_
      }
    };
    return body;
  }

  public buildJsonDenyRequest(id_: number): any {
    const body = {
      query: `mutation($id: ID!) {
        denyRequest(sender: $id, type: FRIENDREQUEST)
      }`
      , variables: {
        id: id_
      }
    };
    return body;
  }

}
