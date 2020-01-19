import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {User} from 'src/app/models/user';
import {Event} from 'src/app/models/event';
import {BehaviorSubject} from 'rxjs';
import {Group} from 'src/app/models/group';
import {tap} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {IFileUploadResult} from '../../models/interfaces/IFileUploadResult';

const getGroupGraphqlQuery = `query($groupId: ID!) {
  getGroup(groupId:$groupId){
      id
      name
      joined
      picture
      creator{id name handle}
      admins{id name handle}
      members{id name handle profilePicture}
      events{id name dueDate joined}
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  public group: BehaviorSubject<Group> = new BehaviorSubject(new Group());

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Builds the getGroup request body
   */
  private static buildGetGroupBody(id: string): any {
    return {
      query: getGroupGraphqlQuery, variables: {groupId: id}
    };
  }

  public getGroupData(groupId: string) {
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return this.http.post(url, GroupService.buildGetGroupBody, {headers: this.headers})
      .pipe(this.retryRated())
      .pipe(tap(response => {
        const group_ = new Group();
        this.group.next(group_.assignFromResponse(response));
        return this.group;
      }));
  }

  public createEvent(name: string, date: string, groupId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {
      query: `mutation($groupId: ID!, $name: String, $date: String) {
        createEvent(name: $name, dueDate: $date, groupId: $groupId) {
          id
          name
          dueDate
          joined
        }
      }`, variables: {
        name: name,
        date: date,
        groupId: groupId
      }
    };

    this.http.post(environment.graphQLUrl, body, {headers: this.headers})
    .pipe(this.retryRated())
    .pipe(tap(response => {
      const event = new Event();
      event.assignFromResponse(response.json().data.createEvent);
      const group = this.group.getValue();
      group.events.push(event);
      this.group.next(group);
    }));
  }

  public joinEvent(eventId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {
      query: `mutation($eventId: ID!) {
      joinEvent(eventId: $eventId) {
        joined
      }
    }`, variables: {
        eventId: eventId
      }
    };
    return this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(this.retryRated());
  }

  public leaveEvent(eventId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {
      query: `mutation($eventId: ID!) {
      leaveEvent(eventId: $eventId) {
        joined
      }
    }`, variables: {
        eventId: eventId
      }
    };
    return this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(this.retryRated());
  }

}
