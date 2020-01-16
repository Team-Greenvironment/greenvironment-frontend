import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected headers: HttpHeaders;

  protected constructor() {
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
  }
}
