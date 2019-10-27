export class Levellist{
    levels: {level: number, name: string, points: number}[] = [
      {level: 0, name: "Green Horn",points: 0},
      {level: 1, name: "Good Willed",points: 100 },
      {level: 2, name: "Helper", points: 200 },
      {level: 3, name: "World Saver", points: 300 },
      {level: 4, name: "Hero of the Green Country", points: 400 },
      {level: 5, name: "Champion of the Earth", points: 500 },
      {level: 6, name: "Intergallactic Superhero", points: 600 },
    ];

  getLevelName(lev:number): any{
    var name: string = 'not defined';
    console.log(lev);
    this.levels.forEach(rank => {
      console.log(rank.level);
      if(lev == rank.level){
        console.log('found matching level');
        name = rank.name;
      } 
    });
    return name
  }

}