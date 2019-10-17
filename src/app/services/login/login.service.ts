import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';
import { User } from 'src/app/models/user';
import { DatasharingService } from '../datasharing.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http, private data: DatasharingService) { }

  public login(login : Login) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(login))
      .subscribe(response => {
        console.log(response.text());
        this.updateUserInfo(response.json())
      });
  }

  public updateUserInfo(pUserInfo : User){
    this.data.changeUserInfo(pUserInfo)
    
  }

  public buildJson(login: Login): any {
    const body =  {query: `mutation($email: String, $pwHash: String) {
      login(email: $email, passwordHash: $pwHash) {id, name, handle, points, level, friends{id}, groups{id},chats{id}} 
    }`, variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }};
    return body;
  }
}//add ,receivedRequests{id} later
