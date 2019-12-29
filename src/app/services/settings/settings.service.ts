import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  users:  Array<User>;
  constructor(private http: Http) {
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
