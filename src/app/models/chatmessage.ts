export class Chatmessage {
  content: string;
  date: string;
  myself: boolean;

  constructor(pContent: string, pDate: string, pMyself: boolean) {
    this.content = pContent;
    this.date = pDate;
    this.myself = pMyself;
  }
}
