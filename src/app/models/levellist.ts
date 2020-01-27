export class Level {
  id: number;
  name: string;
  levelNumber: number;
  points: number;

  constructor(id: number, name: string, levelNumber: number, points: number) {
    this.id = id;
    this.name = name;
    this.levelNumber = levelNumber;
    this.points = points;
  }
}

export class LevelList {
  levels: Level[] = [];

  getLevelName(level: number): string {
    let name = 'not defined';
    for (const rank of this.levels) {
      if (level === rank.levelNumber) {
        name = rank.name;
      }
    }
    return name;
  }
}
