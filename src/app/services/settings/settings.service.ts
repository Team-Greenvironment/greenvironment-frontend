import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import {DatasharingService} from '../datasharing.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  users:  Array<User>;
  constructor(private http: Http, private data: DatasharingService) {
  }

  setDarkModeActive(active: boolean) {
    this.data.setDarkMode(active);
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = this.buildJsonDarkMode('darkmode: ' + '\'' + active + '\'');
    this.http.post(url, body).subscribe(response => {
        console.log(response.text()); });
  }

  public buildJsonDarkMode(setting_: string): any {
    const body = {
      query: `mutation($setting: String!) {
        setUserSettings(settings: $setting)
      }`
      , variables: {
        setting: setting_
      }
    };
    return body;
  }
}
