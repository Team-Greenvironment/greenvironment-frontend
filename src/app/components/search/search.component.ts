import { Component, OnInit} from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import { RequestService } from 'src/app/services/request/request.service';
import {Headers, Http} from '@angular/http';
import { User } from 'src/app/models/user';
import {environment} from 'src/environments/environment';
import { Router } from '@angular/router';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'home-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  loading = false;
  searchValue = ' ';
  category = 'user';
  user: User;
  foundUsers: Array<User>;

  constructor(
    private searchService: SearchService,
    private requestService: RequestService,
    private http: Http,
    private router: Router,
    private data: DatasharingService) { }
  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user;
    });
  }

  changeCategory(value: string) {
    this.category = value;
    this.search(this.searchValue);
  }

  search(searchWord: string) {
    this.foundUsers = Array<User>();
    this.searchValue = searchWord;
    if (searchWord) { // if not null or empty
      if (this.category === 'user') {
        this.loading = true;
        this.findUser(searchWord);
      } else if (this.category === 'groupe') {
        // this.findUserByHandle(searchWord);
        console.log('search group');
      }
    }
  }

  findUser(name: String) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.searchService.buildJsonUser(name))
      .subscribe(response => {
        this.foundUsers = this.searchService.renderUsers(response.json());
        for (const foundUser of this.foundUsers) {
          if (!this.user.loggedIn) {foundUser.allowedToSendRequest = false; } else {
            for (const receiverID of this.user.sentRequestUserIDs) {
              if (foundUser.userID === receiverID ||
                foundUser.userID === this.user.userID) {
                foundUser.allowedToSendRequest = false;
              }
            }
            for (const friend of this.user.friends) {
              if (foundUser.userID === friend.id) {
                foundUser.allowedToSendRequest = false;
              }
            }
            for (const sender of this.user.receivedRequests) {
              if (foundUser.userID === sender.senderUserID) {
                foundUser.allowedToSendRequest = false;
              }
            }
          }
        }
        this.loading = false;
      });
  }

  public showUserProfile(user: User) {
    this.router.navigate(['profile/' + user.userID]);
  }

  public sendFriendRequest(user: User) {
    user.allowedToSendRequest = false;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.requestService.buildJsonRequest(user.userID, 'FRIENDREQUEST'))
      .subscribe(response => {
      });
  }
}

