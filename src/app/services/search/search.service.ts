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

  public renderUsers(pResponse: any): Array<User> {
    const users = new Array<User>();
      for (const user of pResponse.data.search.users) {
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

  public buildJsonUser(name_: String): any {
    const body = {
      query: `query($name: String!) {
        search(query:$name, first: 100, offset: 0) {
          users{
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
        }
      }`
      , variables: {
        name: name_
      }
    };
    return body;
  }
}
