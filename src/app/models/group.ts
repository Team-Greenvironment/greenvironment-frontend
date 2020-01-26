import { User } from 'src/app/models/user';
import { Event } from 'src/app/models/event';
import { IGroup } from './interfaces/IGroup';
import { environment } from 'src/environments/environment';
import { IUser } from './interfaces/IUser';

export class Group {
  id: number;
  name: string;
  creator: User = new User();
  picture: string;
  members: User[] = [];
  admins: User[] = [];
  events: Event[] = [];
  joined: boolean;
  allowedToJoinGroup = false;
  deletable: boolean;

  public assignFromResponse(groupDataResponse: IGroup) {
    if (!groupDataResponse) {
      return null;
    }
    this.id = groupDataResponse.id;
    this.name = groupDataResponse.name;
    this.picture = this.buildPictureUrl(groupDataResponse.picture);
    let user = new User();
    this.creator = user.assignFromResponse(groupDataResponse.creator);
    this.deletable = groupDataResponse.deletable;
    if (groupDataResponse.members) {
      for (const member of groupDataResponse.members) {
        user = new User();
        this.members.push(user.assignFromResponse(member));
      }
    }
    if (groupDataResponse.admins) {
      this.updateAdmins(groupDataResponse.admins);
    }
    if (groupDataResponse.events) {
      for (const event of groupDataResponse.events) {
        const event_ = new Event();
        this.events.push(event_.assignFromResponse(event));
      }
    }
    this.joined = groupDataResponse.joined;

    return this;
  }

  public updateAdmins(admins: IUser[]) {
    // this.admins = [];
    for (const admin of admins) {
      const user = new User();
      this.admins.push(user.assignFromResponse(admin));
    }
    for (const admin of this.admins) {
      for (const member of this.members) {
        if (member.userID === admin.userID) {
          member.isGroupAdmin = true;
        }
      }
    }
  }

  buildPictureUrl(path: string): string {
    if (path) {
      return environment.greenvironmentUrl + path;
    } else {
      return 'assets/images/default-grouppic.svg';
    }
  }
}
