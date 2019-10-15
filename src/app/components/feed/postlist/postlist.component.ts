import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'feed-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.sass']
})
export class PostlistComponent implements OnInit {

  @Input() childPostList: Array<Post>

  constructor() { }

  ngOnInit() {
  }

}
