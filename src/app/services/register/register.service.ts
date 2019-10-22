import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Registration } from '../../models/registration';
import {Router} from '@angular/router';
import { DatasharingService } from '../datasharing.service';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: Http, private data: DatasharingService,private router: Router) { }

  public register(registration: Registration, errorCb: any) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(registration))
      .subscribe(response => {
        console.log(response.text());
        this.registerSuccess();
        this.updateUserInfo(response.json())
      }, errorCb
      );
  }

  public registerSuccess(){
    console.log('alles supi dupi');
    //do routing
    this.router.navigateByUrl('');
  }

  public updateUserInfo(response : any){
    const user: User = new User();
    user.loggedIn = true;
    user.userID = response.data.register.id;
    user.username = response.data.register.name;
    user.handle = response.data.register.handle;
    user.email = response.data.register.email;
    user.points = response.data.register.points;
    user.level = response.data.register.level;
    user.friendIDs = response.data.register.friends;
    user.groupIDs = response.data.register.groups;
    user.chatIDs = response.data.register.chats;
    user.requestIDs = response.data.register.requests;

    this.data.changeUserInfo(user)
    
  }

  public buildJson(registration: Registration): any {
    const body =  {query: `mutation($username: String, $email: String, $pwHash: String) {
      register(username: $username, email: $email, passwordHash: $pwHash) {id, name, handle, points, level, friends{id}, groups{id},chats{id}} 
    }`, variables: {
        email: registration.email,
        pwHash: registration.passwordHash,
        username: registration.username,
      }};
    return body;
  }
}

