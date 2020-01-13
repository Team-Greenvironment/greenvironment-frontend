import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Activitylist } from 'src/app/models/activity';
import { environment } from 'src/environments/environment';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activitylist = new BehaviorSubject<Activitylist>(new Activitylist());
  currentActivityList = this.activitylist.asObservable();

  constructor(private http: Http) { }

  changeUserInfo(pActivitylist: Activitylist) {
    this.activitylist.next(pActivitylist);
  }

  public getActivitys() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.buildJson()).subscribe(result => {
      // push onto subject
      this.activitylist.next(this.renderActivity(result.json()));
    });
  }

  public buildJson(id: string): any {
    const body =  {query: `query($userId: ID) {
      getUser(userId:$userId){
        id
        handle
        name
        profilePicture
        points
        level
        friendCount
        groupCount
        joinedAt
        friends{
          id
        }
        posts{
          id,
          content,
          htmlContent,
          upvotes,
          downvotes,
          userVote,
          deletable,
          author{
            name,
            handle,
            id},
          createdAt
        }
      }
    }`, variables: {
        userId: id,
      }};
    return body;
  }

  public renderActivity(response: any): Activitylist {
    const activitylist = new Activitylist();
    // activitylist.push();
    return activitylist;
  }
}

