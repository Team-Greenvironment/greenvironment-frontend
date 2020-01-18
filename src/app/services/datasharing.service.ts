import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  private userInfoSource = new BehaviorSubject<User>(new User());
  private chatIDsSource = new BehaviorSubject<number[]>(new Array<number>());
  currentUserInfo = this.userInfoSource.asObservable();
  currentChatIDs = this.chatIDsSource.asObservable();

  constructor() {
  }

  changeUserInfo(pUserInfo: User) {
    this.userInfoSource.next(pUserInfo);
  }

  addSentRequestUserID(id: number) {
    const user: User = this.userInfoSource.getValue();
    user.sentRequestUserIDs.push(id);
    this.changeUserInfo(user);
  }

  setDarkMode(active: boolean) {
    const user: User = this.userInfoSource.getValue();
    user.darkmode = active;
    this.changeUserInfo(user);
  }

  changeChatIDs(pChatIDs: number[]) {
    this.chatIDsSource.next(pChatIDs);
  }
}
