import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Post} from 'src/app/models/post';
import {FeedService, Sort, PostingState} from 'src/app/services/feed/feed.service';
import {Activitylist} from 'src/app/models/activity';
import {DatasharingService} from '../../services/datasharing.service';
import {ActivityService} from 'src/app/services/activity/activity.service';
import {User} from 'src/app/models/user';
import {IErrorResponse} from '../../models/interfaces/IErrorResponse';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {
  loadingNew = true;
  loadingMostLiked = true;
  // file upload variables
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  public uploading = false;
  public profilePictureUrl: BehaviorSubject<string | null>;
  private file;
  fileType;
  public localFileUrl;
  posting = false;

  checked = false; // if the "I protected the environment."-box is checked
  view = 'new';
  textInputValue: string;
  // id of the green activity
  value: any;

  parentSelectedPostList: Post[];
  actionlist: Activitylist = new Activitylist();

  loggedIn = false;
  user: User;
  errorOccurred = false;

  private errorMessage: string;

  constructor(
    private feedService: FeedService,
    private data: DatasharingService,
    private activityService: ActivityService
  ) {
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => {
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
    this.feedService.postingState.subscribe(postingState => {
      const temp = this.posting;

      this.posting = postingState.posting;
      this.errorOccurred = postingState.errorOccured;
      this.errorMessage = postingState.errorMessage;

      if (!this.posting  && this.posting !== temp && !postingState.errorOccured) {
        this.resetPostInput();
      }
    });
  }

  /**
   * Creates a new post
   * @param postElement
   * @param activityId
   */
  createPost(postElement, activityId: string) {
    if (postElement && activityId && this.checked) {
      this.feedService.createPostActivity(postElement.value, activityId, this.file).subscribe();
    } else if (postElement) {
      this.feedService.createPost(postElement.value, this.file).subscribe();
    }
  }

  discardFile() {
    this.file = null;
    this.localFileUrl = null;
    this.fileType = null;
    this.fileInput.nativeElement.value = '';
  }

  resetPostInput() {
    this.textInputValue = '';
    this.checked = false;
    this.discardFile();
    if (this.view !== 'new') {
      this.showNew();
    }
  }

  onFileInputChange(event) {
    this.errorOccurred = false;
    this.errorMessage = '';
    this.file = event.target.files[0];
    if (this.file.type.includes('video')) {
      this.fileType = 'video';
    } else if (this.file.type.includes('image')) {
      this.fileType = 'image';
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.localFileUrl = e.target.result;
    };
    reader.readAsDataURL(this.file);
  }

  /**
   * Fetches the next posts when scrolled down
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
