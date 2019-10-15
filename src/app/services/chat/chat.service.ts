import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  name: any

  rates: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  public getSelfName2() {
    this.apollo
    .watchQuery<any>({
      query: gql`
        {
          getSelf {
            name
          }
        }
      `,
    })
    .valueChanges.subscribe(result => {
      this.name = result.data && result.data.name;
      this.loading = result.loading;
      this.error = result.errors;
    });

    console.log(this.name)
  }

  public getSelfName() {
    this.apollo
    .query<any>({
      query: gql`
        {
          rates(currency: "USD") {
            currency
            rate
          }
        }
      `,
    })
    .subscribe(result => {
      this.rates = result.data && result.data.rates;
      this.loading = result.loading;
      this.error = result.errors;
    });

    console.log(this.rates)
  }
}
