export class Activity {
  id: number;
  name: string;
  description: string;
  points: number;

  constructor(id: number, name: string, description: string, points: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.points = points;
  }
}

export class Activitylist {
  Actions: Activity[] = [];
}
