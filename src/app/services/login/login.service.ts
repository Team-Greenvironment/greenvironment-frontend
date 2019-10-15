import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Login } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http) { }

  public login(login : Login) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(login)).subscribe(response => console.log(response.text()));
  }

  public buildJson(login: Login): any {
    const body =  {query: `mutation($email: String, $pwHash: String) {
      login(email: $email, passwordHash: $pwHash) {id}
    }`, variables: {
        email: login.email,
        pwHash: login.passwordHash,
      }};
    return body;
  }
}
