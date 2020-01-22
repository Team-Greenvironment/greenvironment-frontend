import {Component, OnInit} from '@angular/core';
import {GroupInfo} from 'src/app/models/groupinfo';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SocialService} from 'src/app/services/social/social.service';
import {User} from 'src/app/models/user';
import {DatasharingService} from 'src/app/services/datasharing.service';
import {GroupService} from 'src/app/services/group/group.service';
import {Router} from '@angular/router';
import {IErrorResponse} from '../../../models/interfaces/IErrorResponse';

// DIALOG COMPONENT to create groups
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogCreateGroupComponent {
  errorOccurred = false;
  private errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateGroupComponent>, private social: SocialService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createGroup(name: string) {
    name = name.trim();
    if (name) {
      this.social.createGroup(name).subscribe(() => {
        this.dialogRef.close();
      }, ((error: IErrorResponse) => {
        this.errorMessage = error.error.errors[0].message;
        this.errorOccurred = true;
      }));
    }
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}

// GROUP COMPONENT
@Component({
  selector: 'social-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.sass']
})
export class GroupsComponent implements OnInit {
  user: User;

  constructor(public dialog: MatDialog, private data: DatasharingService,
    private router: Router,
    private groupService: GroupService) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  public showGroupProfile(group: GroupInfo) {
    this.router.navigate(['group/' + group.id]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateGroupComponent, {
      width: '250px'
    });
  }

  deleteGroup(group: GroupInfo) {
    this.groupService.deleteGroup(group.id).subscribe();
  }

  leaveGroup(group: GroupInfo) {
    this.groupService.leaveGroup(group.id).subscribe();
  }
}

