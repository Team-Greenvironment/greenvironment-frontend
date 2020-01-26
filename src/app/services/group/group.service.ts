import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Event } from 'src/app/models/event';
import { BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/models/group';
import { tap } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { IFileUploadResult } from '../../models/interfaces/IFileUploadResult';
import { DatasharingService } from 'src/app/services/datasharing.service';

const getGroupGraphqlQuery = `query($groupId: ID!) {
  getGroup(groupId:$groupId){
      id
      name
      joined
      picture
      deletable
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

  constructor(http: HttpClient, private data: DatasharingService) {
    super(http);
  }

  /**
   * Builds the getGroup request body
   */
  private static buildGetGroupBody(id: string): any {
    return {
      query: getGroupGraphqlQuery, variables: { groupId: id }
    };
  }

  public getGroupData(groupId: string) {
    const url = environment.graphQLUrl;

    return this.http.post(url, GroupService.buildGetGroupBody(groupId), { headers: this.headers })
      .pipe(this.retryRated())
      .pipe(tap(response => {
        const group_ = new Group();
        this.group.next(group_.assignFromResponse(response.data.getGroup));
        return this.group.getValue();
      }));
  }

  public createEvent(name: string, date: string, groupId: string) {
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

    return this.postGraphql(body, null, 0)
      .pipe(tap(response => {
        const event = new Event();
        event.assignFromResponse(response.data.createEvent);
        const group = this.group.getValue();
        group.events.push(event);
        this.group.next(group);
      }));
  }


  public addGroupAdmin(userId: string, groupId: string) {
    const body = {
      query: `mutation($groupId: ID!, $userId: ID!) {
          addGroupAdmin(groupId: $groupId, userId: $userId) {
            admins{id name handle profilePicture}
          }
      }`, variables: {
        userId,
        groupId
      }
    };

    return this.postGraphql(body, null, 0)
      .pipe(tap(response => {
        const admins: User[] = [];
        for (const admin of response.data.addGroupAdmin) {
          admins.push(admin.assignFromResponse(admin));
        }
        const group = this.group.getValue();
        group.admins = admins;
        this.group.next(group);
      }));
  }

  public removeGroupAdmin(userId: string, groupId: string) {
    const body = {
      query: `mutation($groupId: ID!, $userId: ID!) {
          removeGroupAdmin(groupId: $groupId, userId: $userId) {
            admins{id name handle profilePicture}
          }
      }`, variables: {
        userId,
        groupId
      }
    };

    return this.postGraphql(body, null, 0)
      .pipe(tap(response => {
        const admins: User[] = [];
        for (const admin of response.data.addGroupAdmin) {
          admins.push(admin.assignFromResponse(admin));
        }
        const group = this.group.getValue();
        group.admins = admins;
        this.group.next(group);
      }));
  }

  public joinEvent(eventId: string) {
    const body = {
      query: `mutation($eventId: ID!) {
      joinEvent(eventId: $eventId) {
        joined
      }
    }`, variables: {
        eventId: eventId
      }
    };
    return this.postGraphql(body)
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
    return this.postGraphql(body);
  }

  public changeProfilePicture(file: any, id: number) {
    const formData: any = new FormData();
    formData.append('groupPicture', file);
    formData.append('groupId', id);
    return this.post<IFileUploadResult>(environment.greenvironmentUrl + '/upload', formData);
  }

  public deleteGroup(groupId: number) {
    const body = {
      query: `mutation($groupId: ID!) {
      deleteGroup(groupId: $groupId)
    }`, variables: {
        groupId
      }
    };
    return this.postGraphql(body)
      .pipe(tap(response => {
        this.data.deleteGroup(groupId);
      }));
  }

  public leaveGroup(groupId: number) {
    const body = {
      query: `mutation($groupId: ID!) {
      leaveGroup(groupId: $groupId){ id }
    }`, variables: {
        groupId
      }
    };
    return this.postGraphql(body)
      .pipe(tap(response => {
        this.data.deleteGroup(groupId);
      }));
  }
}
