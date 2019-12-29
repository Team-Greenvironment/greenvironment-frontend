import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {DatasharingService} from '../datasharing.service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: Http, private data: DatasharingService, private router: Router) {
  }

  public buildJsonRequest(id_: number, type_: String): any {
    const body = {
      query: `mutation($id: ID!, $type: RequestType) {
        sendRequest(receiver: $id, type: $type) {
          id
        }
      }`
      , variables: {
        id: id_,
        type: type_
      }
    };
    return body;
  }

  public buildJsonAcceptRequest(id_: number): any {
    const body = {
      query: `mutation($id: ID!) {
        acceptRequest(sender: $id, type: FRIENDREQUEST)
      }`
      , variables: {
        id: id_
      }
    };
    return body;
  }

  public buildJsonDenyRequest(id_: number): any {
    const body = {
      query: `mutation($id: ID!) {
        denyRequest(sender: $id, type: FRIENDREQUEST)
      }`
      , variables: {
        id: id_
      }
    };
    return body;
  }

}