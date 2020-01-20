import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user';
import {FriendInfo} from '../models/friendinfo';
import {Group} from '../models/group';
import {GroupInfo} from '../models/groupinfo';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  currentUser = new BehaviorSubject<User>(new User());

  constructor() {
  }

  addSentRequestUserID(id: number) {
    const user: User = this.currentUser.getValue();
    user.sentRequestUserIDs.push(id);
    this.currentUser.next(user);
  }

  addGroupToUser(group: GroupInfo) {
    const user = this.currentUser.getValue();
    user.groups.push(group);
    user.groupCount++;
    this.currentUser.next(user);
  }

  addFriendToUser(friend: FriendInfo) {
    const user = this.currentUser.getValue();
    user.friends.push(friend);
    user.friendCount++;
    this.currentUser.next(user);
}

  setDarkMode(active: boolean) {
    const user: User = this.currentUser.getValue();
    user.darkmode = active;
    this.currentUser.next(user);
  }

  changeUserInfo(user: User) {
    this.currentUser.next(user);
  }
}
