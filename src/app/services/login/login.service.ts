import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../../models/login';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {FriendRequest} from 'src/app/models/friendRequest';
import {FriendInfo} from 'src/app/models/friendinfo';
import {GroupInfo} from 'src/app/models/groupinfo';
import {IUser} from '../../models/interfaces/IUser';
import {BaseService} from '../base.service';
import {tap} from 'rxjs/operators';

interface ILoginRequestResult {
  data: {
    login: IUser;
  };
}

const graphqlQuery = `mutation($email: String!, $pwHash: String!) {
  login(email: $email, passwordHash: $pwHash) {
    id,
    name,
    email,
    handle,
    points,
    level,
    receivedRequests{id, sender{name, handle, id}},
    sentRequests{receiver{id}},
    friends {
     id,
     name,
     level
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
export class LoginService extends BaseService {

  constructor(private http: HttpClient, private datasharingService: DatasharingService, private router: Router) {
    super();
  }

  /**
   * Builds the body for the login request
   * @param login
   */
  private static buildRequestBody(login: Login): any {
    return {
      query: graphqlQuery,
      variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }
    };
  }

  /**
   * Performs a login request and returns the data of the logged in user.
   * @param login
   */
  public login(login: Login) {
    const body = LoginService.buildRequestBody(login);
    return this.http.post<ILoginRequestResult>(environment.graphQLUrl, body)
      .pipe(tap(response => {
        const user = new User();
        user.assignFromResponse(response.data.login);
        this.datasharingService.changeUserInfo(user);
      }));
  }
}
