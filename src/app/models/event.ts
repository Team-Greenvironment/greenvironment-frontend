export class Event {
  id: string;
  name: string;
  date: string;
  joined: boolean;

  constructor(pId: string, pName: string, pdate: string, pjoined: boolean) {
    this.id = pId;
    this.name = pName;
    this.date = pdate;
    this.joined = pjoined;
  }
}
