import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Activitylist, Activity } from 'src/app/models/activity';
import { environment } from 'src/environments/environment';
import { Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  public activitylist = new BehaviorSubject<Activitylist>(new Activitylist());

  constructor(private http: Http) { }

  changeUserInfo(pActivitylist: Activitylist) {
    this.activitylist.next(pActivitylist);
  }

  public getActivities() {
    if (this.activitylist.getValue().Actions.length < 1) {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJson()).subscribe(result => {
        // push onto subject
        this.activitylist.next(this.renderActivity(result.json()));
      });
    }
  }

  public buildJson(): any {
    const body =  {query: `query{getActivities{
      id name description points
    }}`, variables: {

      }};
    return body;
  }

  public renderActivity(response: any): Activitylist {
    const activitylist = new Activitylist();
    for (const activity of response.data.getActivities) {
      activitylist.Actions.push(new Activity(
        activity.id,
        activity.name,
        activity.description,
        activity.points));
    }
    return activitylist;
  }
}

