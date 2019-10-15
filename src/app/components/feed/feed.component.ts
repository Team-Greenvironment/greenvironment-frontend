import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {

  viewNew: boolean = true
  viewMostLiked: boolean = false

  feedNew: Array<Post> = [
    new Post("1", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("2", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("3", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("4", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("5", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("6", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10),
    new Post("7", "Niklas", "@nick123", "This is a test message", "01.10.2019 10:00 Uhr", 10)
  ]
  feedMostLiked: Array<Post> = [
    new Post("1", "Max", "@max123", "This is a test message", "01.10.2019 10:00 Uhr", 50),
    new Post("2", "Max", "@max123", "This is a test message", "01.10.2019 10:00 Uhr", 50),
    new Post("3", "Max", "@max123", "This is a test message", "01.10.2019 10:00 Uhr", 50),
    new Post("4", "Max", "@max123", "This is a test message", "01.10.2019 10:00 Uhr", 50),
    new Post("5", "Max", "@max123", "This is a test message", "01.10.2019 10:00 Uhr", 50)
  ]

  parentSelectedPostList: Array<Post> = this.feedNew

  constructor() { }

  ngOnInit() {
  }

  showNew() {
    this.viewNew = true
    this.viewMostLiked = false
    this.parentSelectedPostList = this.feedNew
  }

  showMostLiked() {
    this.viewNew = false
    this.viewMostLiked = true
    this.parentSelectedPostList = this.feedMostLiked
  }

}
