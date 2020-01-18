import {User} from 'src/app/models/user';
import {Event} from 'src/app/models/event';

export class Group {
  id: number;
  name: string;
  handle: string;
  creator: User = new User();
  members: User[] = [];
  admins: User[] = [];
  events: Event[] = [];
  joined: boolean;
  allowedToJoinGroup = false;
}
