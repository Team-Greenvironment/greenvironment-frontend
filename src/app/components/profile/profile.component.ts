import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {LevelList} from 'src/app/models/levellist';
import {RequestService} from 'src/app/services/request/request.service';
import {DatasharingService} from '../../services/datasharing.service';
import {ProfileService} from 'src/app/services/profile/profile.service';
import {HttpClient} from '@angular/common/http';
import {SocialService} from 'src/app/services/social/social.service';
import {SelfService} from '../../services/selfservice/self.service';
import {MatDialog} from '@angular/material';
import {DialogFileUploadComponent} from './fileUpload/fileUpload.component';
import {Lightbox} from 'ngx-lightbox';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  levellist: LevelList = new LevelList();
  ownProfile = false;
  userProfile: User = new User();
  self: User;
  id: string;
  rankname: string;
  profileNotFound = false;
  isFriendOfSelf = false;
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private requestService: RequestService,
    private data: DatasharingService,
    private profileService: ProfileService,
    private socialService: SocialService,
    private lightbox: Lightbox,
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
      this.checkIfUserIsFriend();
    });
    this.profileService.getUserData(this.id);
    this.profileService.proflile.subscribe(response => {
      if (response) {
        this.userProfile = response;
        // tslint:disable-next-line:max-line-length
        this.userProfile.allowedToSendRequest = this.requestService.isAllowedToSendRequest(this.userProfile.userID, this.self);
        this.ownProfile = this.userProfile.userID === this.self.userID;
        this.rankname = this.userProfile.levelName;
      } else {
        this.profileNotFound = true;
      }
      this.loading = false;
    });
  }

  checkIfUserIsFriend() {
    this.isFriendOfSelf = false;
    for (const friend of this.self.friends) {
      if (friend.id.toString() === this.id) {
        this.isFriendOfSelf = true;
        break;
      }
    }
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  removeFriend(user: User) {
    this.socialService.removeFriend(user.userID).subscribe(response => {
      this.checkIfUserIsFriend();
      // tslint:disable-next-line:max-line-length
      this.userProfile.allowedToSendRequest = this.requestService.isAllowedToSendRequest(this.userProfile.userID, this.self);
    });
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

  /**
   * Opens a lightbox with the users profile picture
   */
  openPfpLightbox() {
    this.lightbox.open([{
      src: this.userProfile.profilePicture,
      caption: `${this.userProfile.username}'s profile picture`,
      thumb: this.userProfile.profilePicture,
    }], 0, {disableScrolling: true});
  }
}
