import {Component, OnInit} from '@angular/core';
import {SearchService} from 'src/app/services/search/search.service';
import {RequestService} from 'src/app/services/request/request.service';
import {User} from 'src/app/models/user';
import {Router} from '@angular/router';
import {DatasharingService} from '../../services/datasharing.service';
import {GroupInfo} from 'src/app/models/groupinfo';

@Component({
  selector: 'home-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  loading = false;
  searchValue = ' ';
  category = 'user';
  user: User;
  foundUsers: User[] = [];
  foundGroups: GroupInfo[] = [];

  constructor(
    private searchService: SearchService,
    private requestService: RequestService,
    private router: Router,
    private data: DatasharingService) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  changeCategory(value: string) {
    this.category = value;
    this.search(this.searchValue);
  }

  search(searchWord: string) {
    this.foundUsers = Array<User>();
    this.searchValue = searchWord;
    if (searchWord) { // if not null or empty
      if (this.category === 'user') {
        this.loading = true;
        this.findUser(searchWord);
      }
    }
  }

  findUser(name: string) {
    this.searchService.search(name)
      .subscribe(response => {
        this.foundUsers = this.searchService.getUsersForResponse(response);
        this.foundGroups = this.searchService.getGroupsForResponse(response);
        for (const foundUser of this.foundUsers) {
          foundUser.allowedToSendRequest = this.requestService.isAllowedToSendRequest(foundUser.userID, this.user);
        }
        for (const foundGroup of this.foundGroups) {
          foundGroup.allowedToJoinGroup = this.requestService.isAllowedToJoinGroup(foundGroup.id, this.user);
        }
        this.loading = false;
      });
  }

  public showUserProfile(user: User) {
    this.router.navigate(['profile/' + user.userID]);
  }

  public showGroupProfile(group: GroupInfo) {
    this.router.navigate(['group/' + group.id]);
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  public joinGroup(group: GroupInfo) {
    group.allowedToJoinGroup = false;
    this.requestService.joinGroup(group)
      .subscribe(() => {
        this.data.addGroupToUser(group);
      });
  }
}

