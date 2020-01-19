import {Component, OnInit} from '@angular/core';
import {Post} from 'src/app/models/post';
import {FeedService, Sort} from 'src/app/services/feed/feed.service';
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
    this.feedService.getPosts(Sort.NEW);
    this.feedService.posts.subscribe(response => {
      this.parentSelectedPostList = response;
    });
    this.feedService.postsAvailable.subscribe(available => {
      this.loadingMostLiked = this.loadingNew = available;
    });
  }

  /**
   * Creates a new post
   * @param postElement
   * @param activityId
   */
  createPost(postElement, activityId: string) {
    if (postElement && activityId && this.checked) {
      this.feedService.createPostActivity(postElement.value, activityId).subscribe(() => {
        postElement.value = '';
        this.textInputValue = '';
        this.checked = false;
        if (this.view !== 'new') {
          this.showNew();
        }
      }, (error: IErrorResponse) => {
        this.errorOccurred = true;
        this.errorMessage = error.error.errors[0].message;
      });
    } else if (postElement) {
      this.feedService.createPost(postElement.value).subscribe(() => {
        postElement.value = '';
        this.textInputValue = '';
        this.checked = false;
        if (this.view !== 'new') {
          this.showNew();
        }
      }, (error: IErrorResponse) => {
        this.errorOccurred = true;
        this.errorMessage = error.error.errors[0].message;
      });
    }
  }

  /**
   * Fetches the next posts when scrolled
   */
  onScroll() {
    this.feedService.getNextPosts();
  }

  /**
   * Shows the feed sorted by new
   */
  showNew() {
    this.view = 'new';
    this.feedService.getPosts(Sort.NEW);
  }

  /**
   * Shows the feed sorted by top
   */
  showMostLiked() {
    this.view = 'mostliked';
    this.feedService.getPosts(Sort.TOP);
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
  onTextInputChange() {
    if (this.errorOccurred) {
      this.errorOccurred = false;
      this.errorMessage = '';
    }
  }
}
