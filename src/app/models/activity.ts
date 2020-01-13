
export interface Action {
  id: number;
  name: string;
  points: number;
}

export class Activitylist {
  Actions: Action[] = new Array();
}
