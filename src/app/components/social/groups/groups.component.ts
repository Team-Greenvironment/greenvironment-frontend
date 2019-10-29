import { Component, OnInit } from '@angular/core';
import { GroupInfo } from 'src/app/models/groupinfo';

@Component({
  selector: 'social-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.sass']
})
export class GroupsComponent implements OnInit {
  groups: Array<GroupInfo> = [new GroupInfo(1,"Group 1",[]), new GroupInfo(1,"Group 2",[]), new GroupInfo(1,"Group 3",[]), new GroupInfo(1,"Group 4",[])]
  constructor() { }

  ngOnInit() {
  }

}
