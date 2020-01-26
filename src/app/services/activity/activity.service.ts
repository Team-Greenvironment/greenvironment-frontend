import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Activity, Activitylist} from 'src/app/models/activity';
import {Level, LevelList} from 'src/app/models/levellist';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BaseService} from '../base.service';


@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  public activitylist = new BehaviorSubject<Activitylist>(new Activitylist());
  public levelList = new BehaviorSubject<LevelList>(new LevelList());

  constructor(http: HttpClient) {
    super(http);
  }

  private static buildGetActivityBody(): any {
    const body = {
      query: `query{getActivities{
      id name description points
    }}`, variables: {}
    };
    return body;
  }

  private static buildGetLevelsBody(): any {
    const body = {
      query: `query{getLevels{
      id name levelNumber points
    }}`, variables: {}
    };
    return body;
  }

  changeUserInfo(pActivitylist: Activitylist) {
    this.activitylist.next(pActivitylist);
  }

  public getActivities() {
    if (this.activitylist.getValue().Actions.length < 1) {
      this.http.post(environment.graphQLUrl, ActivityService.buildGetActivityBody(), {headers: this.headers})
      .pipe(this.retryRated())
      .subscribe(result => {
        // push onto subject
        this.activitylist.next(this.renderActivity(result));
      });
    }
  }

  public getLevels() {
    if (this.activitylist.getValue().Actions.length < 1) {
      this.http.post(environment.graphQLUrl, ActivityService.buildGetLevelsBody(), {headers: this.headers})
      .pipe(this.retryRated())
      .subscribe(result => {
        // push onto subject
        this.levelList.next(this.renderLevels(result));
      });
    }
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

  public renderLevels(response: any): LevelList {
    const levelList = new LevelList();
    for (const level of response.data.getLevels) {
      levelList.levels.push(new Level(
        level.id,
        level.name,
        level.levelNumber,
        level.points));
    }
    return levelList;
  }
}

