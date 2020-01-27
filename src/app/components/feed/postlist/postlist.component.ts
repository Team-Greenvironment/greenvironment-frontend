import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';
import { Router } from '@angular/router';
import { DatasharingService } from 'src/app/services/datasharing.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ReportReason } from 'src/app/models/reportReason';

@Component({
  selector: 'feed-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.sass']
})
export class PostlistComponent implements OnInit {

  @Input() childPostList: Post[];
  @Output() voteEvent = new EventEmitter<boolean>();
  selectedPost: Post;
  loggedIn = false;
  reportReasons: ReportReason[] = new Array();

  constructor(private feedService: FeedService,
    private data: DatasharingService,
    private router: Router,
    private activityService: ActivityService) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
      this.loggedIn = user.loggedIn;
    });
    this.activityService.getReportReasons();
    this.activityService.reportReasonList.subscribe(response => {
      this.reportReasons = response;
    });
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

  reportPost(reason: ReportReason, post: Post) {
    this.feedService.reportPost(reason.id, post.id).subscribe();
  }

  onLoad(post: Post) {
    post.mediaLoading = false;
  }

  public showUserProfile(post: any) {
    this.router.navigate(['profile/' + post.author.id]);
  }
}
