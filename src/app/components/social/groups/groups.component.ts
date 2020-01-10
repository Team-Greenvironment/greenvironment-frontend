import { Component, Inject, OnInit } from '@angular/core';
import { GroupInfo } from 'src/app/models/groupinfo';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SocialService } from 'src/app/services/social/social.service';
import { User } from 'src/app/models/user';
import { DatasharingService } from 'src/app/services/datasharing.service';

// DIALOG COMPONENT to create groups
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogCreateGroupComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCreateGroupComponent>, private social: SocialService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  createGroup(name: string) {
    console.log('create groupe ' + name);
    name = name.trim();
    if (name) {
    this.social.createGroup(name);
    this.dialogRef.close();
  }

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
  constructor(public dialog: MatDialog, private data: DatasharingService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
    this.user = user; });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateGroupComponent, {
      width: '250px'
    });
  }
}

