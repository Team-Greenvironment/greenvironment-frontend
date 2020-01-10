import { User } from 'src/app/models/user';

export class Group {
  id: number;
  name: string;
  handle: string;
  creator: User;
  member: User[] = new Array();
}
