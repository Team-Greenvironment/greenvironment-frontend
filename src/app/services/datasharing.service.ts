import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  private userInfoSource = new BehaviorSubject<User>(new User())
  currentUserInfo = this.userInfoSource.asObservable();

  constructor() { }

  changeUserInfo(pUserInfo: User) {
    this.userInfoSource.next(pUserInfo)
  }
}
