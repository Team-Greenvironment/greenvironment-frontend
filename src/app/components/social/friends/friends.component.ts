import {Component, OnInit} from '@angular/core';
import {DatasharingService} from 'src/app/services/datasharing.service';
import {SocialService} from 'src/app/services/social/social.service';
import {FriendInfo} from 'src/app/models/friendinfo';
import {Router} from '@angular/router';
import {User} from 'src/app/models/user';

@Component({
  selector: 'social-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.sass']
})
export class FriendsComponent implements OnInit {
  user: User;

  constructor(private data: DatasharingService, private router: Router, private socialService: SocialService) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  public showFriendProfile(pFriend: FriendInfo) {
    this.router.navigate(['profile/' + pFriend.id]);
  }

  removeFriend(friend: FriendInfo) {
    this.socialService.removeFriend(friend.id).subscribe();
  }

}
