import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';

@Component({
  selector: 'feed-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.sass']
})
export class PostlistComponent implements OnInit {

  @Input() childPostList: Array<Post>
  @Output() voteEvent = new EventEmitter<boolean>()
  selectedPost: Post

  constructor(private feedService: FeedService) { }

  ngOnInit() {
  }

  voteUp(pPost: Post) {
    this.feedService.upvote(pPost.id).subscribe(response => {
        this.voteEvent.emit(true)})
  }

  voteDown(pPost: Post) {
    this.feedService.downvote(pPost.id).subscribe(response => {
        this.voteEvent.emit(true)})
  }

}
