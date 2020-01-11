export class Event {
    id: number;
    name: string;
    date: string;

    constructor(pId: number, pName: string, pdate: string) {
        this.id = pId;
        this.name = pName;
        this.date = pdate;
    }
}
