import {IGroup} from './IGroup';

export interface IUser {

  id: number;

  name: string;

  handle: string;

  profilePicture?: string;

  level: number;

  points: number;

  numberOfPosts: number;

  postCount: number;

  posts: any[];

  joinedAt: Date;

  friendCount: number;

  friends: IUser[];

  groupCount: number;

  groups: IGroup[];

  eventCount: number;

  events: any[];
}
