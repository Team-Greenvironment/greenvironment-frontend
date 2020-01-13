import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';
import { Activitylist } from 'src/app/models/activity';
import { DatasharingService } from '../../services/datasharing.service';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {
  loading = true;

  checked: boolean; // if the "I protected the environment."-box is checked
  empty: any;
 // id of the green activity
  value: any;

  parentSelectedPostList: Array<Post>;
  actionlist: Activitylist = new Activitylist();

  loggedIn = false;
  user: User;

  constructor(
    private feedService: FeedService,
    private data: DatasharingService,
    private activityService: ActivityService
    ) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user;
      this.loggedIn = user.loggedIn;
    });
    this.activityService.getActivitys();
    this.activityService.activitylist.subscribe(response => {
      this.actionlist = response;
    });
    this.feedService.getNewPosts();
    this.feedService.posts.subscribe(response => {
      if (response.length > 0) {this.loading = false; }
      this.parentSelectedPostList = response;
    });
  }

  createPost(pElement, activityId: string) {
    if (pElement && activityId) {
    this.feedService.createPostActivity(pElement.value, activityId);
    pElement.value = '';
    this.empty = '';
    } else if (pElement) {
      this.feedService.createPost(pElement.value);
      pElement.value = '';
      this.empty = '';
    }
  }

  showNew() {
    this.feedService.getNewPosts();
  }

  showMostLiked() {
    this.feedService.getMostLikedPosts();
  }
}
