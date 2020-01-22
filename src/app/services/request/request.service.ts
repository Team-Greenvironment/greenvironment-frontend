import {Injectable} from '@angular/core';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {GroupInfo} from 'src/app/models/groupinfo';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base.service';


const denyRequestGqlQuery = `mutation($id: ID!) {
  denyRequest(sender: $id, type: FRIENDREQUEST)
}`;

const acceptRequestGqlQuery = `mutation($id: ID!) {
  acceptRequest(sender: $id, type: FRIENDREQUEST)
}`;

const sendRequestGqlQuery = `mutation($id: ID!, $type: RequestType) {
  sendRequest(receiver: $id, type: $type) {
    id
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class RequestService extends BaseService {

  constructor(http: HttpClient, private data: DatasharingService, private router: Router) {
    super(http);
  }

  private static buildDenyRequestBody(id: number): any {
    return {
      query: denyRequestGqlQuery
      , variables: {
        id
      }
    };
  }

  private static buildAcceptRequestBody(id: number): any {
    return {
      query: acceptRequestGqlQuery
      , variables: {
        id
      }
    };
  }

  private static buildJoinGroupBody(id: number): any {
    return {
      query: `mutation($id: ID!) {
        joinGroup(groupId: $id) {
          id
        }
      }`
      , variables: {
        id
      }
    };
  }

  private static buildSendRequestBody(id: number, type: String): any {
    return {
      query: sendRequestGqlQuery
      , variables: {
        id,
        type
      }
    };
  }

  public isAllowedToSendRequest(userID: number, self: User): boolean {
    if (!self.loggedIn) {
      return false;
    } else {
      if (userID === self.userID) {
        return false;
      }
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

  /**
   * Sends a send request
   * @param user
   */
  public sendFriendRequest(user: User) {
    this.postGraphql(RequestService.buildSendRequestBody(user.userID, 'FRIENDREQUEST'))
      .subscribe(() => {
        this.data.addSentRequestUserID(user.userID);
      });
  }

  /**
   * Joins a group
   * @param group
   */
  public joinGroup(groupId: number) {
    console.log('join group' + groupId);
    return this.postGraphql(RequestService.buildJoinGroupBody(groupId));
  }

  /**
   * Accepts a request
   * @param id
   */
  public acceptRequest(id: number) {
    return this.postGraphql(RequestService.buildAcceptRequestBody(id));
  }

  /**
   * Denys a request
   * @param id
   */
  public denyRequest(id: number) {
    return this.postGraphql(RequestService.buildDenyRequestBody(id));
  }
}
