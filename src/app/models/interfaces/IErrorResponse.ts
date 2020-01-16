import {IGraphqlError} from './IGraphqlError';

export interface IErrorResponse {
  error: {
    errors: IGraphqlError[];
    data: any;
  };
}
