import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {delay, mergeMap, retry, retryWhen} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../../environments/environment';

const httpTooManyCode = 429;
const httpHeaderRateRetry = 'Retry-After';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected headers: HttpHeaders;
  protected constructor(protected http?: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
  }

  /**
   * Does a http post request
   * @param url
   * @param body
   * @param options
   * @param retryLimit
   */
  protected post<T>(url: string, body: any, options?: any, retryLimit: number = 3): Observable<any | T> {
    return this.http.post<T>(url, body, Object.assign({headers: this.headers}, options))
      .pipe(this.retryRated(retryLimit));
  }

  /**
   * Does a http post to the graphql url
   * @param body
   * @param options
   * @param retryLimit
   */
  protected postGraphql<T>(body: any, options?: any, retryLimit: number = 3): Observable<any | T> {
    return this.post<T>(environment.graphQLUrl, body, options, retryLimit);
  }

  /**
   * Retries a request according to the rate limit
   * @param maxRetry
   */
  protected retryRated(maxRetry = 3) {
    let retries = maxRetry;
    return (src: Observable<any>) => {
      return src.pipe(retryWhen(errors => errors.pipe(mergeMap(error => {
          if (error.status === httpTooManyCode) {
            const retryAfter = Number(error.headers.get(httpHeaderRateRetry) || 1) * 1000;
            return of(error.status).pipe(delay(retryAfter));
          } else if (retries-- > 0) {
            return of(error).pipe(delay(10000));
          }
          return throwError(error);
        }))
      ));
    };
  }
}
