import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';
import { User } from 'src/app/models/user';
import { DatasharingService } from '../datasharing.service';
import { userInfo } from 'os';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http, private data: DatasharingService,private router: Router) { }

  public login(login : Login, errorCb: any) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(login))
      .subscribe(response => {
        console.log(response.text());
        this.loginSuccess();
        this.updateUserInfo(response.json())
      }, errorCb
      );
  }
  public loginSuccess(){
    console.log('alles supi dupi');
    //do routing
    this.router.navigateByUrl(''); 
  }

  public updateUserInfo(response : any){
    const user: User = new User();
    user.loggedIn = true;
    user.userID = response.data.login.id;
    user.username = response.data.login.name;
    user.handle = response.data.login.handle;
    user.email = response.data.login.email;
    user.points = response.data.login.points;
    user.level = response.data.login.level;
    user.friendIDs = response.data.login.friends;
    user.groupIDs = response.data.login.groups;
    user.chatIDs = response.data.login.chats;
    user.requestIDs = response.data.login.requests;

    this.data.changeUserInfo(user)
    
  }

  public buildJson(login: Login): any {
    const body =  {query: `mutation($email: String, $pwHash: String) {
      login(email: $email, passwordHash: $pwHash) {id, name,email, handle, points, level, friends{id}, groups{id},chats{id}} 
    }`, variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }};
    return body;
  }
}//add ,receivedRequests{id} later
