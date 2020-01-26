import { IEvent } from './interfaces/IEvent';

export class Event {
  id: string;
  name: string;
  date: string;
  joined: boolean;
  deletable: boolean;

  public assignFromResponse(eventDataResponse: IEvent) {
    this.id = eventDataResponse.id;
    this.name = eventDataResponse.name;
    const temp = new Date(Number(eventDataResponse.dueDate));
    this.date = temp.toLocaleString('en-GB');
    this.joined = eventDataResponse.joined;
    this.deletable = eventDataResponse.deletable;

    return this;
  }

}
