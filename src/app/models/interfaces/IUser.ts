import {IGroup} from './IGroup';
import {ISettings} from './ISettings';
import {IChat} from './IChat';
import {IRequest} from './IRequest';

export interface IUser {

  id: number;

  name: string;

  handle: string;

  email?: string;

  profilePicture?: string;

  settings?: string;

  level: number;

  points: number;

  numberOfPosts: number;

  postCount: number;

  posts: any[];

  chats: IChat[];

  receivedRequests: IRequest[];

  sentRequests: IRequest[];

  joinedAt: string;

  friendCount: number;

  friends: IUser[];

  groupCount: number;

  groups: IGroup[];

  eventCount: number;

  events: any[];
}