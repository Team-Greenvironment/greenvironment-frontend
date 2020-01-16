import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { RequestService } from 'src/app/services/request/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-list',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.sass']
})
export class UserlistComponent implements OnInit {

  @Input() userList: Array<User>;
  selectedUser: User;

  constructor(private requestService: RequestService, private router: Router) { }

  ngOnInit() {
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  public showUserProfile(user: User) {
    this.router.navigate(['profile/' + user.userID]);
  }
}
