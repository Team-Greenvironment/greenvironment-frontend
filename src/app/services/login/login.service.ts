import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Login} from '../../models/login';
import {User} from 'src/app/models/user';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  public login(login: Login, errorCb: any) {

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(environment.graphQLUrl, this.buildJson(login))
      .subscribe(response => {
          console.log(response.text());
          this.loginSuccess();
          this.updateUserInfo(response.json());
        }, errorCb
      );
  }

  public loginSuccess() {
    console.log('alles supi dupi');
    this.router.navigateByUrl('');
  }

  public updateUserInfo(response: any) {
    const loginData = response.data.login;
    const user: User = new User(
      loginData.login.id,
      true,
      loginData.name,
      loginData.handle,
      loginData.email,
      loginData.points,
      loginData.level,
      loginData.friends,
      loginData.groups,
      loginData.chats,
      loginData.requests,
    );

    this.data.changeUserInfo(user);
  }

  public buildJson(login: Login): any {
    const body = {
      query: `mutation($email: String, $pwHash: String) {
        login(email: $email, passwordHash: $pwHash) {
          id,
          name,
          email,
          handle,
          points,
          level,
          friends {
           id
          },
          groups {
            id
          },
          chats{
            id
          }
        }
      }`
      , variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }
    };
    return body;
  }
}
