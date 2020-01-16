import {IUser} from './IUser';

export enum RequestType {
  FRIENDREQUEST = 'FRIENDREQUEST',
  GROUPINVITE = 'GROUPINVITE',
  EVENTINVITE = 'EVENTINVITE',
}

export interface IRequest {

  id: number;

  sender: IUser;

  receiver: IUser;

  type: RequestType;
}
