import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {Levellist} from 'src/app/models/levellist';
import {RequestService} from 'src/app/services/request/request.service';
import {DatasharingService} from '../../services/datasharing.service';
import {ProfileService} from 'src/app/services/profile/profile.service';
import {HttpClient} from '@angular/common/http';
import {SelfService} from '../../services/selfservice/self.service';
import {MatDialog} from '@angular/material';
import {DialogFileUploadComponent} from './fileUpload/fileUpload.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  levellist: Levellist = new Levellist();
  ownProfile = false;
  userProfile: User = new User();
  self: User;
  id: string;
  rankname: string;
  profileNotFound = false;

  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private requestService: RequestService,
    private data: DatasharingService,
    private profileService: ProfileService,
    private selfService: SelfService,
    public dialog: MatDialog) {
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

  ngOnInit() {
    this.loading = true;
    this.id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.data.currentUser.subscribe(user => {
      this.self = user;
    });
    this.profileService.getUserData(this.id);
    this.profileService.proflile.subscribe(response => {
      if (response) {
        this.userProfile = response;
        // tslint:disable-next-line:max-line-length
        this.userProfile.allowedToSendRequest = this.requestService.isAllowedToSendRequest(this.userProfile.userID, this.self);
        this.ownProfile = this.userProfile.userID === this.self.userID;
        this.rankname = this.levellist.getLevelName(this.userProfile.level);
      } else {
        this.profileNotFound = true;
      }
      this.loading = false;
    });
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  /**
   * Opens the file upload dialog
   */
  openFileUploadDialog() {
    const dialogRef = this.dialog.open(DialogFileUploadComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.profilePictureUrl.subscribe((profilePictureUrl) => {
      if (profilePictureUrl) {
        this.userProfile.profilePicture = profilePictureUrl;
      }
    });
  }
}
