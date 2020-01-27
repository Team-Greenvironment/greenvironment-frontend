export class ReportReason {
  id: number;
  name: string;
  description: string;

  constructor(id: number, name: string, describtion: string) {
    this.id = id;
    this.name = name;
    this.description = describtion;
  }
}