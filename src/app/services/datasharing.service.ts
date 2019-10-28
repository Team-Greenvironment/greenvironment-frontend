import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  private userInfoSource = new BehaviorSubject<User>(new User())
  private chatIDsSource = new BehaviorSubject<number[]>(new Array<number>())
  currentUserInfo = this.userInfoSource.asObservable()
  currentChatIDs = this.chatIDsSource.asObservable()

  constructor() { }

  changeUserInfo(pUserInfo: User) {
    this.userInfoSource.next(pUserInfo)
  }

  changeChatIDs(pChatIDs: number[]) {
    this.chatIDsSource.next(pChatIDs)
  }
}
