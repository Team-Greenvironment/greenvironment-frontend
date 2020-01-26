export class FriendInfo {
  id: number;
  name: string;
  rankname = 'Rookie';
  profilePicture: string;

  constructor(id: number, name: string, level: {name: string}, pic: string) {
    this.id = id;
    this.name = name;
    if (level) {
      this.rankname = level.name;
    }
    this.profilePicture = pic;
  }
}
