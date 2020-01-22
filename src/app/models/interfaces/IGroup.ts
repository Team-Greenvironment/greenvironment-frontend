import {IUser} from './IUser';

export interface IGroup {

  id: number;

  name: string;

  picture: string;

  creator: IUser;

  admins: IUser[];

  members: IUser[];

  chat: any;

  events: any;

  joined: boolean;

  deletable: boolean;
}
