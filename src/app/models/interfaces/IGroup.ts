import {IUser} from './IUser';

export interface IGroup {

  id: number;

  name: string;

  creator: IUser;

  admins: IUser[];

  members: IUser[];

  chat: any;

  events: any;

  joined: boolean;
}
