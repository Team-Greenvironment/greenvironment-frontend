import { Component, OnInit } from '@angular/core';
import { DatasharingService } from 'src/app/services/datasharing.service';
import { FriendInfo } from 'src/app/models/friendinfo';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'social-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.sass']
})
export class FriendsComponent implements OnInit {
  user: User;
  constructor(private data: DatasharingService, private router: Router) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
    this.user = user; });
  }

  public showFriendProfile(pFriend: FriendInfo) {
    this.router.navigate(['profile/' + pFriend.id]);
  }

}
