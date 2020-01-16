import {IUser} from './IUser';

export interface IChat {

  id: number;

  namespace: string;

  members: IUser[];

  messages: any[];
}
