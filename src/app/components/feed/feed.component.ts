import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';
import { Actionlist } from 'src/app/models/actionlist';
import { DatasharingService } from '../../services/datasharing.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {
  loading = true;
  checked: boolean; // if the "I protected the environment."-box is checked
  empty: boolean;
 // points value of the green action
  value: any;
  viewNew = true;
  viewMostLiked = false;

  feedNew: Array<Post>;
  feedMostLiked: Array<Post>;

  parentSelectedPostList: Array<Post>;

  actionlist: Actionlist = new Actionlist();

  loggedIn = false;
  userId: number;
  user: User;

  constructor(private feedService: FeedService, private data: DatasharingService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user;
      this.loggedIn = user.loggedIn;
      if (this.loggedIn) {
        this.userId = user.userID;
        this.feedService.getAllPostsRawByUserId(this.userId).subscribe(response => {
          this.loading = false;
          this.feedNew = this.feedService.renderAllPosts(response.json());
          this.parentSelectedPostList = this.feedNew;
          this.feedMostLiked = this.feedNew;
        });
      } else {
        this.feedService.getAllPostsRaw().subscribe(response => {
          this.loading = false;
          this.feedNew = this.feedService.renderAllPosts(response.json());
          this.parentSelectedPostList = this.feedNew;
          this.feedMostLiked = this.feedNew;
        });
      }
    });

  }

  createPost(pElement) {
    this.feedService.createPost(pElement.value);
    pElement.value = '';
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json());
      this.parentSelectedPostList = this.feedNew;
      this.feedMostLiked = this.feedNew; });
  }

  showNew() {
    this.feedService.getAllPostsRawByUserId(this.userId).subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json());
      this.parentSelectedPostList = this.feedNew; });
    this.viewNew = true;
    this.viewMostLiked = false;
  }

  showMostLiked() {
    this.feedService.getAllPostsRawByUserId(this.userId).subscribe(response => {
      this.feedMostLiked = this.feedService.renderAllPosts(response.json());
      this.parentSelectedPostList = this.feedMostLiked; });
    this.viewNew = false;
    this.viewMostLiked = true;
  }


  refresh($event) {
    this.feedService.getAllPostsRawByUserId(this.userId).subscribe(response => {
      this.parentSelectedPostList = this.feedService.renderAllPosts(response.json());
    });
  }

}
