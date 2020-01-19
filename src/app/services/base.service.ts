import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {delay, mergeMap, retryWhen} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';

const httpTooManyCode = 429;
const httpHeaderRateRetry = 'Retry-After';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected headers: HttpHeaders;
  protected constructor() {
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
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
