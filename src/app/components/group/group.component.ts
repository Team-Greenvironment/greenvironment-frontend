import { Component, OnInit, ViewChild } from '@angular/core';
import { Data, NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MatSort } from '@angular/material/sort';
import { RequestService } from 'src/app/services/request/request.service';
import { DatasharingService } from '../../services/datasharing.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group } from 'src/app/models/group';
import { Event } from 'src/app/models/event';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogGroupFileUploadComponent } from './fileUpload/fileUpload.component';
import { Lightbox } from 'ngx-lightbox';

// DIALOG COMPONENT to create events
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogCreateEventComponent {
  groupId: string;
  private errorMessage: string;
  errorOccurred: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateEventComponent>,
    private group: GroupService,
    private router: Router) {
    this.groupId = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Creates a new event
   * @param name
   * @param date
   * @param time
   */
  createEvent(name: string, date: string, time: string) {
    name = name.trim();
    this.errorOccurred = false;
    if (name && date && time) {
      date = date + ' ' + time;
      this.group.createEvent(name, (new Date(date)).getTime().toString(), this.groupId)
        .subscribe((response) => {
          this.dialogRef.close();
        }, (error) => {
          if (error.error) {
            this.errorMessage = error.error.errors[0].message;
            this.errorOccurred = true;
          }
        });
    }
  }

  /**
   * Returns the error message
   */
  getErrorMessage(): string {
    return this.errorMessage;
  }

}

// GROUP COMPONENT
@Component({
  selector: 'app-profile',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})

export class GroupComponent implements OnInit {
  groupProfile: Group = new Group();
  self: User;
  id: string;
  isAdmin = false;
  isCreator = false;
  groupNotFound = false;

  loading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private requestService: RequestService,
    private data: DatasharingService,
    private groupService: GroupService,
    private lightbox: Lightbox,
    private datasharingService: DatasharingService) {
    router.events.forEach((event) => {
      // check if url changes
      if (event instanceof NavigationEnd) {
        const possibleID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
        if (this.id !== possibleID && this.id && this.router.url.includes('group/')) {
          // reload the group
          this.ngOnInit();
        }
      }
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.loading = true;
    this.id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.data.currentUser.subscribe(user => {
      this.self = user;
    });
    this.groupService.getGroupData(this.id).subscribe();
    this.groupService.group.subscribe(response => {
      this.isAdmin = false;
      if (response) {
        this.groupProfile = response;
        // tslint:disable-next-line:max-line-length
        this.groupProfile.allowedToJoinGroup = this.requestService.isAllowedToJoinGroup(this.groupProfile.id, this.self);
        for (const admin of this.groupProfile.admins) {
          if (admin.userID === this.self.userID) {
            this.isAdmin = true;
          }
        }
        if (this.groupProfile.creator.userID === this.self.userID) {
          this.isCreator = true;
        } else {
          this.isCreator = false;
        }
        for (const member of this.groupProfile.members) {
          member.allowedToSendRequest = this.requestService.isAllowedToSendRequest(member.userID, this.self);
        }
      } else {
        this.groupNotFound = true;
      }
      this.loading = false;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateEventComponent, {
      width: '250px'
    });
  }

  /**
   * Opens the file upload dialog
   */
  openFileUploadDialog() {
    const dialogRef = this.dialog.open(DialogGroupFileUploadComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.groupId = this.groupProfile.id;
    dialogRef.componentInstance.profilePictureUrl.subscribe((profilePictureUrl) => {
      if (profilePictureUrl) {
        this.groupProfile.picture = profilePictureUrl;
      }
    });
  }

  public joinGroup(group: Group) {
    group.allowedToJoinGroup = false;
    this.requestService.joinGroup(group.id)
      .subscribe(() => {
        this.datasharingService.addGroupToUser(group);
        this.groupProfile.joined = true;
      });
  }

  public joinEvent(event: Event) {
    this.groupService.joinEvent(event.id).subscribe(response => {
      const pEvent = response.data.joinEvent;
      event.joined = pEvent.joined;
    });
  }

  public leaveEvent(event: Event) {
    this.groupService.leaveEvent(event.id).subscribe(response => {
      const pEvent = response.data.leaveEvent;
      event.joined = pEvent.joined;
    });
  }

  public deleteEvent(event: Event) {
    this.groupService.deleteEvent(event.id).subscribe();
  }

  public showUserProfile(user: User) {
    this.router.navigate(['profile/' + user.userID]);
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  private deleteGroup() {
    this.groupService.deleteGroup(this.groupProfile.id)
      .subscribe(response => {
        this.router.navigateByUrl('');
      });
  }

  leaveGroup() {
    this.groupService.leaveGroup(this.groupProfile.id).subscribe(response => {
      this.groupProfile.joined = false;
      // tslint:disable-next-line:max-line-length
      this.groupProfile.allowedToJoinGroup = this.requestService.isAllowedToJoinGroup(this.groupProfile.id, this.self);
    });
  }

  addGroupAdmin(user: User) {
    this.groupService.addGroupAdmin(user.userID.toString(), this.id).subscribe();
  }

  removeGroupAdmin(user: User) {
    this.groupService.removeGroupAdmin(user.userID.toString(), this.id).subscribe();
  }

  openPfpLightbox() {
    this.lightbox.open([{
      src: this.groupProfile.picture,
      thumb: this.groupProfile.picture,
    }], 0, { disableScrolling: true });
  }

}
