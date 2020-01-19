import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base.service';

const graphqlCreateGroupQuery = `mutation($name: String!) {
  createGroup(name: $name) {
    id
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class SocialService extends BaseService {

  constructor(private http: HttpClient) {
    super();
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
    return this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(this.retryRated());
  }
}
