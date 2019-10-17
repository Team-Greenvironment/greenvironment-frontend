import { Injectable, EventEmitter, Output } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http) { }

  @Output() showChatEvent = new EventEmitter<Chatinfo>();

  public login(login : Login) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(login))
      .subscribe(response => {
        console.log(response.text());
        this.saveUserData(response.json())
      });
  }

  public saveUserData(text : any){
    app = text.name;
    
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
