import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';

@Component({
  selector: 'feed-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.sass']
})
export class PostlistComponent implements OnInit {

  @Input() childPostList: Array<Post>
  selectedPost: Post

  constructor(private feedService: FeedService) { }

  ngOnInit() {
  }

  voteUp(pPost: Post){
    this.feedService.voteUp(pPost.id)
    console.log("UPVOTE", pPost.id)
  }

  voteDown(pPost: Post){
    this.feedService.voteDown(pPost.id)
  }

}
