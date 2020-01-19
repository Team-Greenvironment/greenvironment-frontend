import {Injectable} from '@angular/core';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {IFileUploadResult} from '../../models/interfaces/IFileUploadResult';

const getSelfGraphqlQuery = `{
  getSelf{
    id,
    name,
    email,
    handle,
    points,
    level,
    profilePicture,
    receivedRequests{id, sender{name, handle, id}},
    sentRequests{receiver{id}},
    friends {
     id,
     name,
     level,
     profilePicture,
    },
    groups {
      id,
      name
    },
    chats{
      id
    },
    settings
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class SelfService extends BaseService {

  constructor(private http: HttpClient, private data: DatasharingService) {
    super();
  }

  /**
   * Builds the getself request body
   */
  private static buildGetSelfBody(): any {
    return {
      query: getSelfGraphqlQuery, variables: {}
    };
  }

  /**
   * Checks if the user is still logged in
   */
  public checkIfLoggedIn() {
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, SelfService.buildGetSelfBody(), {headers: this.headers})
      .pipe(this.retryRated())
      .pipe(tap(response => {
        this.updateUserInfo(response);
      }));
  }

  /**
   * Uploads a file as a profile picture
   * @param file
   */
  public changeProfilePicture(file: any) {
    const formData: any = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<IFileUploadResult>(environment.greenvironmentUrl + '/upload', formData)
      .pipe(this.retryRated());
  }

  /**
   * Updates the info on a user
   * @param response
   */
  public updateUserInfo(response: any) {
    const user = new User();
    user.assignFromResponse(response.data.getSelf);
    this.data.changeUserInfo(user);
  }
}
