import { Component, OnInit} from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import {Headers, Http} from '@angular/http';
import { User } from 'src/app/models/user';
import {environment} from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'home-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  searchValue = ' ';
  category = 'username';
  foundUsers: Array<User>;

  constructor(private searchService: SearchService, private http: Http, private router: Router) { }
  ngOnInit() {
  }

  changeCategory(value: string) {
    this.category = value;
    this.search(this.searchValue);
  }

  search(searchWord: string) {
    this.foundUsers = Array<User>();
    this.searchValue = searchWord;
    if (searchWord) {
      if (this.category === 'username') {
        this.findUserByName(searchWord);
      } else if (this.category === 'handle') {
        this.findUserByHandle(searchWord);
      }
    }
  }

  findUserByName(name: String) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.searchService.buildJsonName(name))
      .subscribe(response => {
        this.foundUsers = this.searchService.renderUsers(response.json());
      });
  }

  findUserByHandle(name: String) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.searchService.buildJsonHandle(name))
      .subscribe(response => {
        this.foundUsers = this.searchService.renderUsers(response.json());
      });
  }

  public showUserProfile(user: User) {
    console.log(user);
    this.router.navigate(['profile/' + user.userID]);
  }
}

