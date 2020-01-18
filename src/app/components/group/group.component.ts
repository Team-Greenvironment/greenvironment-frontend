import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {MatSort} from '@angular/material/sort';
import {RequestService} from 'src/app/services/request/request.service';
import {DatasharingService} from '../../services/datasharing.service';
import {GroupService} from 'src/app/services/group/group.service';
import {Group} from 'src/app/models/group';
import {Event} from 'src/app/models/event';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

// DIALOG COMPONENT to create events
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogCreateEventComponent {
  groupId: string;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateEventComponent>,
    private group: GroupService,
    private router: Router) {
    this.groupId = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createEvent(name: string, date: string, time: string) {
    name = name.trim();
    if (name && date && time) {
      date = date + ' ' + time;
      console.log(date);
      console.log(new Date(date).getTime().toString());
      this.group.createEvent(name, (new Date(date)).getTime().toString(), this.groupId);
      this.dialogRef.close();
    }
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
  groupNotFound = false;

  loading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private requestService: RequestService,
    private data: DatasharingService,
    private groupService: GroupService) {
    router.events.forEach((event) => {
      // check if url changes
      if (event instanceof NavigationEnd) {
        const possibleID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
        if (this.id !== possibleID && this.id && this.router.url.includes('group/')) {
          // reload the group
          console.log('search for group id: ' + this.router.url.substr(this.router.url.lastIndexOf('/') + 1));
          this.ngOnInit();
        }
      }
    });
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.loading = true;
    this.id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.data.currentUserInfo.subscribe(user => {
      this.self = user;
    });
    this.groupService.getGroupData(this.id);
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

  public joinGroup(group: Group) {
    group.allowedToJoinGroup = false;
    this.requestService.joinGroup(group);
  }

  public joinEvent(event: Event) {
    this.groupService.joinEvent(event.id).subscribe(response => {
      const pEvent = response.json().data.joinEvent;
      event.joined = pEvent.joined;
    });
  }

  public leaveEvent(event: Event) {
    this.groupService.leaveEvent(event.id).subscribe(response => {
      const pEvent = response.json().data.leaveEvent;
      event.joined = pEvent.joined;
    });
  }

  public showUserProfile(user: User) {
    this.router.navigate(['profile/' + user.userID]);
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }
}
