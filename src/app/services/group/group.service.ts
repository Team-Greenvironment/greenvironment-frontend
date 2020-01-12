import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Event } from 'src/app/models/event';
import { Observable, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public group: BehaviorSubject<Group> = new BehaviorSubject(new Group());

  constructor(private http: Http) { }

  public getGroupData(groupId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.buildGetGroupJson(groupId)).subscribe(result => {
      // push onto subject
      this.group.next(this.renderGroup(result.json()));
      return this.group;
    });
  }

  public buildGetGroupJson(id: string): any {
    const body = {
      query: `query($groupId: ID!) {
      getGroup(groupId:$groupId){
          id
          name
          creator{id name handle}
          admins{id name handle}
          members{id name handle}
          events{id name dueDate joined}
      }
    }`, variables: {
      groupId: id
      }
    };
    return body;
  }

  public renderGroup(response: any): Group {
    const group = new Group();
    if (response.data.getGroup != null) {
      group.id = response.data.getGroup.id;
      group.name = response.data.getGroup.name;
      group.creator.userID = response.data.getGroup.creator.id;
      group.creator.handle = response.data.getGroup.creator.handle;
      group.creator.username = response.data.getGroup.creator.name;
      for (const member of response.data.getGroup.members) {
        const user = new User();
        user.userID = member.id;
        user.username = member.name;
        user.handle = member.handle;
        group.members.push(user);
      }
      for (const admin of response.data.getGroup.admins) {
        const user = new User();
        user.userID = admin.id;
        user.username = admin.name;
        user.handle = admin.handle;
        group.admins.push(user);
      }
      for (const event of response.data.getGroup.events) {
        const temp = new Date(Number(event.dueDate));
        const date = temp.toLocaleString('en-GB');
        group.events.push(new Event(event.id, event.name, date, event.joined));
      }
      return group;
    }
    return null;
  }

  public createEvent(name: string, date: string, groupId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {query: `mutation($groupId: ID!, $name: String, $date: String) {
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
      }};

    this.http.post(environment.graphQLUrl, body).subscribe(response => {
      const event = response.json().data.createEvent;
      const temp = new Date(Number(event.dueDate));
      const pdate = temp.toLocaleString('en-GB');
      this.group.next(
        this.renderGroup(this.group.getValue().events.push(new Event(event.id, event.name, pdate, event.joined)))
      );
    });
  }

  public joinEvent(eventId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {query: `mutation($eventId: ID!) {
      joinEvent(eventId: $eventId) {
        joined
      }
    }`, variables: {
          eventId: eventId
      }};
    return this.http.post(environment.graphQLUrl, body);
  }

  public leaveEvent(eventId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {query: `mutation($eventId: ID!) {
      leaveEvent(eventId: $eventId) {
        joined
      }
    }`, variables: {
          eventId: eventId
      }};
    return this.http.post(environment.graphQLUrl, body);
  }

}
