import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { Registration } from '../../models/registration';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: Http) { }

  public register(registration: Registration) {
 
    let url = './graphql'
 
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, headers, this.buildJson(registration));
  }

  public buildJson(registration: Registration): String {
    const body = 'mutation {'
      + 'register(username: ' + registration.username + ', email: ' + registration.email
      + 'passwordHash: ' + registration.passwordHash + ') {'
        'id} }'
    return body
  }
}

