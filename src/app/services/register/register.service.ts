import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Registration } from '../../models/registration';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: Http) { }

  public register(registration: Registration) {
 
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(registration)).subscribe(response => console.log(response.text()));
  }

  public buildJson(registration: Registration): any {
    const body =  {query: `mutation($username: String, $email: String, $pwHash: String) {
      register(username: $username, email: $email, passwordHash: $pwHash) {id}
    }`, variables: {
        email: registration.email,
        pwHash: registration.passwordHash,
        username: registration.username,
      }};
    return body;
  }
}

