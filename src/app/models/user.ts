export class User {
  loggedIn: boolean;
  userID: number;
  username: string;
  handle: string;
  email: string;
  points: number;
  level: number;
  profilePicture: string;

  friendIDs: number[];
  groupIDs: number[];
  chatIDs: number[];

  requestIDs: number[];
}
