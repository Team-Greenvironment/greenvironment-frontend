import { FriendRequest } from 'src/app/models/friendRequest';
import { FriendInfo } from 'src/app/models/friendinfo';
import { GroupInfo } from 'src/app/models/groupinfo';
import { Post } from 'src/app/models/post';

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

  friends: FriendInfo[] = new Array();
  groups: GroupInfo[] = new Array();
  posts: Post[] = new Array();
  chatIDs: number[];
  receivedRequests: FriendRequest[] = new Array();
  sentRequestUserIDs: number[] = new Array(); // IDs of users that already received requests of the logged in user
  allowedToSendRequest = true; /* if a user already received a request this should
  be false to avoid multiple invitations*/
}
