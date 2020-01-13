import { User } from 'src/app/models/user';
import { Event } from 'src/app/models/event';

export class Group {
  id: number;
  name: string;
  handle: string;
  creator: User = new User();
  members: User[] = new Array();
  admins: User[] = new Array();
  events: Event[] = new Array();
  joined: boolean;
  allowedToJoinGroup = false;
}
