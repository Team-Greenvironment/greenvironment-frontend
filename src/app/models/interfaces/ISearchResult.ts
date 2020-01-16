import {IUser} from './IUser';
import {IGroup} from './IGroup';

export interface ISearchResult {
  users: IUser[];

  groups: IGroup[];

  posts: any[];

  events: any[];
}
