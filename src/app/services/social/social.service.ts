import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  users:  Array<User>;
  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  createGroup(name: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.buildJsonGroup(name)).subscribe(response => {
        console.log(response.text()); });
  }

  public buildJsonGroup(name_: String): any {
    const body = {
      query: `mutation($name: String!) {
        createGroup(name: $name) {
          id
        }
      }`
      , variables: {
        name: name_
      }
    };
    return body;
  }
}
