import {Component, OnInit} from '@angular/core';
import {Post} from 'src/app/models/post';
import {FeedService} from 'src/app/services/feed/feed.service';
import {Activitylist} from 'src/app/models/activity';
import {DatasharingService} from '../../services/datasharing.service';
import {ActivityService} from 'src/app/services/activity/activity.service';
import {User} from 'src/app/models/user';
import {IErrorResponse} from '../../models/interfaces/IErrorResponse';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {
  loadingNew = true;
  loadingMostLiked = true;

  checked = false; // if the "I protected the environment."-box is checked
  view = 'new';
  textInputValue: string;
  // id of the green activity
  value: any;

  parentSelectedPostList: Post[];
  actionlist: Activitylist = new Activitylist();

  loggedIn = false;
  user: User;
  errorOccurred: boolean;

  private errorMessage: string;

  constructor(
    private feedService: FeedService,
    private data: DatasharingService,
    private activityService: ActivityService
  ) {
  }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user;
      this.loggedIn = user.loggedIn;
    });
    this.activityService.getActivities();
    this.activityService.activitylist.subscribe(response => {
      this.actionlist = response;
    });
    this.feedService.getPosts('NEW');
    this.feedService.posts.subscribe(response => {
      this.parentSelectedPostList = response;
    });
    this.feedService.newPostsAvailable.subscribe(response => {
      this.loadingNew = response;
    });
    this.feedService.topPostsAvailable.subscribe(response => {
      console.log(response);
      this.loadingMostLiked = response;
    });
  }

  createPost(pElement, activityId: string) {
    if (pElement && activityId && this.checked) {
      this.feedService.createPostActivity(pElement.value, activityId).subscribe(() => {
        pElement.value = '';
        this.textInputValue = '';
        this.view = 'new';
      }, (error: IErrorResponse) => {
        this.errorOccurred = true;
        this.errorMessage = error.error.errors[0].message;
      });
    } else if (pElement) {
      this.feedService.createPost(pElement.value).subscribe(() => {
        pElement.value = '';
        this.textInputValue = '';
        this.view = 'new';
      }, (error: IErrorResponse) => {
        this.errorOccurred = true;
        this.errorMessage = error.error.errors[0].message;
      });
    }
  }

  onScroll() {
    console.log('scrolled');
    this.feedService.getNextPosts();
  }

  showNew() {
    this.feedService.getPosts('NEW');
  }

  showMostLiked() {
    this.feedService.getPosts('TOP');
  }

  /**
   * Returns the error message if one exists
   */
  getErrorMessage() {
    return this.errorMessage;
  }

  /**
   * Executed when the text in the input field changes.
   */
  private onTextInputChange() {
    if (this.errorOccurred) {
      this.errorOccurred = false;
      this.errorMessage = '';
    }
  }
}
