import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../../models/login';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {environment} from 'src/environments/environment';
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
    profilePicture,
    receivedRequests{id, sender{name, handle, id}},
    sentRequests{receiver{id}},
    friends {
     id,
     name,
     level,
     profilePicture
    },
    groups {
      id,
      name,
      picture
    },
    chats{
      id
    },
    settings
  }
}`;

const logoutGqlQuery = `mutation {
        logout
      }`;

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  constructor(http: HttpClient, private datasharingService: DatasharingService) {
    super(http);
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
   * Builds a logout request
   */
  public static buildLogoutBody(): any {
    return {
      query: logoutGqlQuery
    };
  }

  /**
   * Performs a login request and returns the data of the logged in user.
   * @param login
   */
  public login(login: Login) {
    const body = LoginService.buildRequestBody(login);
    return this.postGraphql<ILoginRequestResult>(body, null, 0)
      .pipe(tap(response => {
        const user = new User();
        user.assignFromResponse(response.data.login);
        this.datasharingService.changeUserInfo(user);
      }));
  }

  /**
   * Loggs out
   */
  public logout() {
    return this.postGraphql(LoginService.buildLogoutBody());
  }
}
