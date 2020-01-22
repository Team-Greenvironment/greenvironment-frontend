import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base.service';
import { tap } from 'rxjs/internal/operators/tap';
import {DatasharingService} from 'src/app/services/datasharing.service';

const graphqlCreateGroupQuery = `mutation($name: String!) {
  createGroup(name: $name) {
    id
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class SocialService extends BaseService {

  constructor(http: HttpClient,
    private data: DatasharingService) {
    super(http);
  }

   /**
   * Builds the body for a group creation request
   * @param name
   */
  private static buildGroupCreateBody(name: String): any {
    return {
      query: graphqlCreateGroupQuery, variables: {
        name
      }
    };
  }

  /**
   * Creates a group
   * @param name
   */
  createGroup(name: string) {
    const body = SocialService.buildGroupCreateBody(name);
    return this.postGraphql(body);
  }

  public removeFriend(id: number) {
    const body = {
      query: `mutation($id: ID!) {
      removeFriend(friendId: $id)
    }`, variables: {
        id
      }
    };
    return this.postGraphql(body)
    .pipe(tap(response => {
      this.data.removeFriendFromUser(id);
    }));
  }
}
