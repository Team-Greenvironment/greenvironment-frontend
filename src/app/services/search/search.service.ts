import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  users:  Array<User>;
  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  public findUserByName(name: String): Array<User> {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(environment.graphQLUrl, this.buildJsonName(name))
      .subscribe(response => {
        this.users = this.renderUsers(response.json());
      });
    return this.users;
  }

  public findUserByHandle(handle: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    return this.http.post(environment.graphQLUrl, this.buildJsonHandle(handle))
      .subscribe(response => {
          console.log(response.text());
        }
      );
  }

  public renderUsers(pResponse: any): Array<User> {
    const users = new Array<User>();
    if (pResponse.data.findUser === 'null') {
      console.log('no user found');
      return null;
    } else {
      for (const user of pResponse.data.findUser) {
        const pUser = new User();
        pUser.profilePicture = user.profilePicture;
        pUser.username = user.name;
        pUser.userID = user.id;
        pUser.handle = user.handle;
        pUser.points = user.points;
        pUser.level = user.level;
        pUser.friendIDs = user.friends;
        users.push(pUser);
      }
      return users;
    }
  }

  public buildJsonName(name_: String): any {
    const body = {
      query: `query($name: String) {
        findUser(name: $name, first: 100, offset: 0) {
          profilePicture,
          name,
          id,
          handle,
          points,
          level,
          friends {
           id
          }
        }
      }`
      , variables: {
        name: name_
      }
    };
    return body;
  }
  public buildJsonHandle(handle_: String): any {
    const body = {
      query: `query($handle: String) {
        findUser(handle: $handle, first: 100, offset: 0) {
          profilePicture,
          name,
          id,
          handle,
          points,
          level,
          friends {
           id
          }
        }
      }`
      , variables: {
        handle: handle_
      }
    };
    return body;
  }
}
