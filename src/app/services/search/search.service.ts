import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {GroupInfo} from 'src/app/models/groupinfo';
import {Observable} from 'rxjs';
import {ISearchResult} from '../../models/interfaces/ISearchResult';
import {environment} from '../../../environments/environment';
import {BaseService} from '../base.service';

interface ISearchRequestResult {
  data: {
    search: ISearchResult;
  };
}

const graphqlQuery = `query($query: String!, $first: Int, $offset: Int) {
  search(query:$query, first: $first, offset: $offset) {
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
    groups{
      id
      name
      creator{id name handle}
      members{id name handle}
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class SearchService extends BaseService {
  constructor(http: HttpClient, private data: DatasharingService, private router: Router) {
    super(http);
  }

  /**
   * Builds the body for the request
   * @param query - the search query
   * @param first - the limit of elements to fetch
   * @param offset - offset
   */
  private static buildRequestBody(query: String, first: number = 20, offset: number = 0): any {
    return {
      query: graphqlQuery,
      variables: {
        query,
        first,
        offset
      }
    };
  }

  /**
   * Maps the users in the response to the user class
   * @param response
   */
  public getUsersForResponse(response: ISearchRequestResult): User[] {
    const users = new Array<User>();
    for (const foundUser of response.data.search.users) {
      const user = new User();
      user.profilePicture = user.buildProfilePictureUrl(foundUser.profilePicture);
      user.username = foundUser.name;
      user.userID = foundUser.id;
      user.handle = foundUser.handle;
      user.points = foundUser.points;
      user.level = foundUser.level;
      // @ts-ignore
      user.friends = foundUser.friends;
      users.push(user);
    }
    return users;
  }

  /**
   * Maps the groups in the response to the group class
   * @param response
   */
  public getGroupsForResponse(response: ISearchRequestResult): Array<GroupInfo> {
    const groups = new Array<GroupInfo>();
    for (const group of response.data.search.groups) {
      groups.push(new GroupInfo(group.id, group.name));
    }
    return groups;
  }

  /**
   * Searches for users, groups, events and posts with a specified query.
   * @param query
   */
  public search(query: string): Observable<ISearchRequestResult> {
    const body = SearchService.buildRequestBody(query);
    return this.postGraphql<ISearchRequestResult>(body)
      .pipe(this.retryRated());
  }
}
