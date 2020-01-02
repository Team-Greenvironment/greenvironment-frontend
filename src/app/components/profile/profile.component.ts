import { Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
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
  private user: User = new User();
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
    private data: DatasharingService) { }

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
      this.user.loggedIn = true;
      this.user.userID = response.data.getUser.id;
      this.user.username = response.data.getUser.name;
      this.user.handle = response.data.getUser.handle;
      this.user.points = response.data.getUser.points;
      this.user.level = response.data.getUser.level;
      this.rankname = this.levellist.getLevelName(this.user.level);
      this.user.allowedToSendRequest = this.requestService.isAllowedToSendRequest(response.data.getUser.id, this.self);
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
