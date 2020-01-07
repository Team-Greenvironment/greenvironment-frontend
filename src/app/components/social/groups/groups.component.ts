import { Component, OnInit, Inject } from '@angular/core';
import { GroupInfo } from 'src/app/models/groupinfo';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'social-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.sass']
})
export class GroupsComponent implements OnInit {
  // TODO: replace with actual logic that loads the groups from the backend
  groups: Array<GroupInfo> = [
    new GroupInfo(1, 'Group 1', []),
    new GroupInfo(1, 'Group 2', []),
    new GroupInfo(1, 'Group 3', []),
    new GroupInfo(1, 'Group 4', [])];
  constructor() { }

  ngOnInit() {
  }

}
