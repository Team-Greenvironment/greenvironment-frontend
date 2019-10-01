import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'social-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.sass']
})
export class FriendsComponent implements OnInit {
  friends: Array<String> = ["Friend 1", "Friend 2", "Friend 3", "Friend 4", "Friend 5", "Friend 6"]
  constructor() { }

  ngOnInit() {
  }

}
