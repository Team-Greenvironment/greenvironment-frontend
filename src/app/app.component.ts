import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  constructor() { }

  loggedIn : boolean = false;
  userID : number;
  username : string;
  handle : string;
  email : string;
  points : number;
  level : number;

  friendIDs : number[];
  groupIDs : number[];
  chatIDs : number[];

  requestIDs : number[];

  ngOnInit() { }
}
