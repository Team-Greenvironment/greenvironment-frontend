import { Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { User } from 'src/app/models/user';
import { Actionlist } from 'src/app/models/actionlist';
import { Levellist } from 'src/app/models/levellist';
import { environment } from 'src/environments/environment';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RequestService } from 'src/app/services/request/request.service';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})

export class ProfileComponent implements OnInit {
  actionlist: Actionlist = new Actionlist();

  levellist: Levellist = new Levellist();
  userProfile: User = new User();
  self: User;
  id: string;
  rankname: string;
  profileNotFound = false;
  displayedColumns = ['points', 'name'];
  dataSource = new MatTableDataSource(this.actionlist.Actions);
  displayedLevelColumns = ['level', 'name'];
  levelSource = this.levellist.levels;

  constructor(
    private router: Router,
    private http: Http,
    private requestService: RequestService,
    private data: DatasharingService) {
      router.events.forEach((event) => {
        // check if the user is on the profile page (of userY) and routes to the page of userY (e.g. his own page)
        if (event instanceof NavigationEnd) {
          if (this.id !== this.router.url.substr(this.router.url.lastIndexOf('/') + 1) && this.id) {
            // reload the user
            this.ngOnInit();
          }
        }
      });
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    // let url = './graphql'
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.buildJson(this.id))
      .subscribe(response => {
        console.log(response.text());
        this.updateUserInfo(response.json());
      });
      this.data.currentUserInfo.subscribe(user => {
        this.self = user;
      });
  }

  public updateUserInfo(response: any) {
    if (response.data.getUser != null) {
      this.profileNotFound = false;
      this.userProfile.loggedIn = true;
      this.userProfile.userID = response.data.getUser.id;
      this.userProfile.username = response.data.getUser.name;
      this.userProfile.handle = response.data.getUser.handle;
      this.userProfile.points = response.data.getUser.points;
      this.userProfile.level = response.data.getUser.level;
      this.rankname = this.levellist.getLevelName(this.userProfile.level);
      // tslint:disable-next-line:max-line-length
      this.userProfile.allowedToSendRequest = this.requestService.isAllowedToSendRequest(response.data.getUser.id, this.self);
    } else {
      this.profileNotFound = true;
    }
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    this.requestService.sendFriendRequest(user);
  }

  public buildJson(id: string): any {
    const body =  {query: `query($userId: ID) {
      getUser(userId:$userId){
        id
        handle
        name
        profilePicture
        points
        level
        friendCount
        friends{
          id
        }
        posts{
          content
        }
      }
    }`, variables: {
        userId: this.id
      }};
    return body;
  }
}
