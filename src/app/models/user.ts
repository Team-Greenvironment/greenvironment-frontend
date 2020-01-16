import { FriendRequest } from 'src/app/models/friendRequest';
import { FriendInfo } from 'src/app/models/friendinfo';
import { GroupInfo } from 'src/app/models/groupinfo';
import { Post } from 'src/app/models/post';
import {IUser} from './interfaces/IUser';

export class User {
  loggedIn = false;
  userID: number;
  username: string;
  handle: string;
  email: string;
  points: number;
  level: number;
  profilePicture: string;
  joinedAt: string;
  friendCount: number;
  groupCount: number;

  darkmode = false;

  friends: FriendInfo[] = [];
  groups: GroupInfo[] = [];
  posts: Post[] = [];
  chatIDs: number[];
  receivedRequests: FriendRequest[] = [];
  sentRequestUserIDs: number[] = []; // IDs of users that already received requests of the logged in user
  allowedToSendRequest = true; /* if a user already received a request this should
  be false to avoid multiple invitations*/

  public assignFromResponse(userDataResponse: IUser) {
    this.userID = userDataResponse.id;
    this.username = userDataResponse.name;
    this.handle = userDataResponse.handle;
    this.email = userDataResponse.email;
    this.points = userDataResponse.points;
    this.level = userDataResponse.level;
    this.profilePicture = userDataResponse.profilePicture;
    this.joinedAt = userDataResponse.joinedAt;
    this.friendCount = userDataResponse.friendCount;
    this.groupCount = userDataResponse.groupCount;
    try {
      this.darkmode = !!JSON.parse(userDataResponse.settings).darkmode;
    } catch (err) {
      console.error(err);
    }
    this.friends = userDataResponse.friends
      .map(friend => new FriendInfo(friend.id, friend.name, friend.level));
    this.groups = userDataResponse.groups
      .map(group => new GroupInfo(group.id, group.name));
    this.chatIDs = userDataResponse.chats.map(chat => chat.id);
    this.sentRequestUserIDs = userDataResponse.sentRequests
      .map(request => request.receiver.id);
    this.receivedRequests = userDataResponse.receivedRequests
      .map(request => new FriendRequest(request.id, request.sender.id, request.sender.handle, request.sender.name));
  }
}
