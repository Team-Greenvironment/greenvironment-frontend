export class User {
  constructor(
    public userID: number,
    public loggedIn: boolean,
    public username: string,
    public handle: string,
    public email: string,
    public points: number,
    public level: number,
    public friendIDs: number[],
    public groupIDs: number[],
    public chatIDs: number[],
    public requestIDs: number[],
  ) {}
}
