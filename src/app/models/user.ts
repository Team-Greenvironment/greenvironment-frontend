import { FriendRequest } from 'src/app/models/friendRequest';
import { FriendInfo } from 'src/app/models/friendinfo';
import { GroupInfo } from 'src/app/models/groupinfo';
import { Post } from 'src/app/models/post';
import { IUser } from './interfaces/IUser';
import { environment } from 'src/environments/environment';

export class User {
  loggedIn = false;
  userID: number;
  username: string;
  handle: string;
  email: string;
  points: number;
  level = 0;
  levelName = 'Rookie';
  profilePicture: string;
  joinedAt: string;
  friendCount: number;
  groupCount: number;
  isAdmin: boolean = false;
  isGroupAdmin: boolean;

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
    this.loggedIn = true;
    this.userID = userDataResponse.id;
    this.username = userDataResponse.name;
    this.handle = userDataResponse.handle;
    this.email = userDataResponse.email;
    this.points = userDataResponse.points;
    if (userDataResponse.level) {
      this.level = userDataResponse.level.levelNumber;
      this.levelName = userDataResponse.level.name;
    }
    this.profilePicture = this.buildProfilePictureUrl(userDataResponse.profilePicture);
    this.joinedAt = userDataResponse.joinedAt;
    this.friendCount = userDataResponse.friendCount;
    this.groupCount = userDataResponse.groupCount;
    if (userDataResponse.settings) {
      try {
        this.darkmode = !!JSON.parse(userDataResponse.settings).darkmode;
      } catch (err) {
        console.error(err);
      }
    }
    if (userDataResponse.friends) {
      this.friends = userDataResponse.friends
        .map(friend => new FriendInfo(
          friend.id, friend.name,
          friend.level,
          this.buildProfilePictureUrl(friend.profilePicture)
        ));
    }
    if (userDataResponse.groups) {
      /*for (const group of userDataResponse.groups) {
      const group_ = new Group();
      this.groups.push(group_.assignFromResponse(group));
      } doesnt work because of circular injection*/
      this.groups = userDataResponse.groups
        .map(group => new GroupInfo(group.id, group.name, group.picture, group.deletable));
    }
    if (userDataResponse.chats) {
      this.chatIDs = userDataResponse.chats.map(chat => chat.id);
    }
    if (userDataResponse.sentRequests) {
      this.sentRequestUserIDs = userDataResponse.sentRequests
        .map(request => request.receiver.id);
    }
    if (userDataResponse.receivedRequests) {
      this.receivedRequests = userDataResponse.receivedRequests
        .map(request => new FriendRequest(request.id, request.sender.id, request.sender.handle, request.sender.name));
    }
    if (userDataResponse.isAdmin) {
      this.isAdmin = true;
    }
    return this;
  }

  buildProfilePictureUrl(path: string): string {
    if (path) {
      return environment.greenvironmentUrl + path;
    } else {
      return 'assets/images/default-profilepic.svg';
    }
  }
}
