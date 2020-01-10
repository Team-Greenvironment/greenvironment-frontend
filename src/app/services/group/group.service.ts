import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable, Subject } from 'rxjs';
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public group: Subject<any> = new Subject();

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
      }
    }`, variables: {
      groupId: id
      }
    };
    return body;
  }

  public renderGroup(response: any): Group {
    console.log(response);
    console.log(response.data.getGroup.creator.id);
    const group = new Group();
    const members: User[] = new Array();
    const admins: User[] = new Array();
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
        members.push(user);
      }
      group.members = members;
      for (const admin of response.data.getGroup.admins) {
        const user = new User();
        user.userID = admin.id;
        user.username = admin.name;
        user.handle = admin.handle;
        admins.push(user);
      }
      group.admins = admins;
      console.log(group);
      return group;
    }
    return null;
  }
}
