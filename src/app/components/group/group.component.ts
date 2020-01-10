import { Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { User } from 'src/app/models/user';
import {MatSort} from '@angular/material/sort';
import { RequestService } from 'src/app/services/request/request.service';
import { DatasharingService } from '../../services/datasharing.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-profile',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})

export class GroupComponent implements OnInit {
  groupProfile: Group = new Group();
  self: User;
  id: string;
  groupNotFound = false;

  loading = false;

  constructor(
    private router: Router,
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
        if (response) {
          this.groupProfile = response;
          // tslint:disable-next-line:max-line-length
          this.groupProfile.allowedToJoinGroup = this.requestService.isAllowedToJoinGroup(this.groupProfile.id, this.self);
        } else { this.groupNotFound = true; }
        this.loading = false;
      });
  }

  public joinGroup(group: Group) {
    group.allowedToJoinGroup = false;
    this.requestService.joinGroup(group);
  }
}
