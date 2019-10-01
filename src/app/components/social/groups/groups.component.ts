import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'social-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.sass']
})
export class GroupsComponent implements OnInit {
  groups: Array<String> = ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6"]
  constructor() { }

  ngOnInit() {
  }

}
