import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from 'src/app/models/post';
import {FeedService} from 'src/app/services/feed/feed.service';
import {Router} from '@angular/router';

@Component({
  selector: 'feed-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.sass']
})
export class PostlistComponent implements OnInit {

  @Input() childPostList: Post[];
  @Output() voteEvent = new EventEmitter<boolean>();
  selectedPost: Post;

  constructor(private feedService: FeedService, private router: Router) {
  }

  ngOnInit() {
  }

  voteUp(pPost: Post) {
    this.feedService.upvote(pPost.id).subscribe(response => {
      // this.voteEvent.emit(true);
      pPost.userVote = response.data.vote.post.userVote;
      pPost.upvotes = response.data.vote.post.upvotes;
      pPost.downvotes = response.data.vote.post.downvotes;
    });
  }

  voteDown(pPost: Post) {
    this.feedService.downvote(pPost.id).subscribe(response => {
      // this.voteEvent.emit(true);
      pPost.userVote = response.data.vote.post.userVote;
      pPost.upvotes = response.data.vote.post.upvotes;
      pPost.downvotes = response.data.vote.post.downvotes;
    });
  }

  deletePost(pPost: Post) {
    this.feedService.deletePost(pPost.id).subscribe(response => {
      for (let i = 0; i < this.childPostList.length; i++) {
        if (this.childPostList[i].id === pPost.id) {
          this.childPostList.splice(i, 1);
          return;
        }
      }
    });
  }

  public showUserProfile(post: any) {
    this.router.navigate(['profile/' + post.author.id]);
  }
}
