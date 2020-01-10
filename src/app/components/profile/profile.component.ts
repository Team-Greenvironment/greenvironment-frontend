import { Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { User } from 'src/app/models/user';
import { Actionlist } from 'src/app/models/actionlist';
import { Levellist } from 'src/app/models/levellist';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RequestService } from 'src/app/services/request/request.service';
import { DatasharingService } from '../../services/datasharing.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})

export class ProfileComponent implements OnInit {
  actionlist: Actionlist = new Actionlist();

  levellist: Levellist = new Levellist();
  userProfile: User = new User();
  self: User;
  id: string;
  rankname: string;
  profileNotFound = false;
  displayedColumns = ['points', 'name'];
  dataSource = new MatTableDataSource(this.actionlist.Actions);
  displayedLevelColumns = ['level', 'name'];
  levelSource = this.levellist.levels;

  loading = false;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private data: DatasharingService,
    private profileService: ProfileService) {
      router.events.forEach((event) => {
        // check if the user is on the profile page (of userY) and routes to the page of userY (e.g. his own page)
        if (event instanceof NavigationEnd) {
          const possibleID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
          if (this.id !== possibleID && this.id && this.router.url.includes('profile/')) {
            // reload the user
            this.ngOnInit();
          }
        }
      });
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    this.loading = true;
    this.dataSource.sort = this.sort;
    this.id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.data.currentUserInfo.subscribe(user => {
      this.self = user;
    });
    if (this.self.loggedIn) {
      this.profileService.getUserDataBySelfId(this.id, this.self.userID.toString());
    } else {
      this.profileService.getUserData(this.id);
    }
    this.profileService.proflile.subscribe(response => {
        if (response) {
          this.userProfile = response;
          // tslint:disable-next-line:max-line-length
          this.userProfile.allowedToSendRequest = this.requestService.isAllowedToSendRequest(this.userProfile.userID, this.self);
          this.rankname = this.levellist.getLevelName(this.userProfile.level);
        } else { this.profileNotFound = true; }
        this.loading = false;
      });
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }
}
