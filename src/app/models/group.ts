import { User } from 'src/app/models/user';

export class Group {
  id: number;
  name: string;
  handle: string;
  creator: User = new User();
  members: User[] = new Array();
  admins: User[] = new Array();
  allowedToJoinGroup = false;
}
