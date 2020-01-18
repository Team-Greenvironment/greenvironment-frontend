export interface IGraphqlError {

  message: string;

  path: string[];

  location: { line: number; column: number }[];
}
