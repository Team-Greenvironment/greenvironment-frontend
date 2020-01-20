import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Post} from 'src/app/models/post';
import {Author} from 'src/app/models/author';
import {environment} from 'src/environments/environment';
import {Activity} from 'src/app/models/activity';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {BaseService} from '../base.service';
import {formatDate} from '@angular/common';

const createPostGqlQuery = `mutation($content: String!) {
  createPost(content: $content) {
    id,
    content,
    htmlContent,
    upvotes,
    downvotes,
    userVote,
    deletable,
    activity{
      id
      name
      description
      points
    },
    author{
      name,
      handle,
      profilePicture,
      id},
    createdAt}
}`;

const createPostActivityGqlQuery = `mutation($content: String!, $id: ID) {
  createPost(content: $content activityId: $id) {
    id,
    content,
    htmlContent,
    upvotes,
    downvotes,
    userVote,
    deletable,
    activity{
      id
      name
      description
      points
    },
    author{
      name,
      handle,
      profilePicture,
      id},
    createdAt}
}`;

const upvotePostGqlQuery = `mutation($postId: ID!) {
  vote(postId: $postId, type: UPVOTE) {
    post{userVote upvotes downvotes}
  }
}`;

const downvotePostGqlQuery = `mutation($postId: ID!) {
  vote(postId: $postId, type: DOWNVOTE) {
    post{userVote upvotes downvotes}
  }
}`;

const getPostGqlQuery = `query($first: Int, $offset: Int, $sort: SortType){
  getPosts (first: $first, offset: $offset, sort: $sort) {
    id,
    content,
    htmlContent,
    upvotes,
    downvotes,
    userVote,
    deletable,
    activity{
      id
      name
      description
      points
    },
    author{
      name,
      handle,
      profilePicture,
      id},
    createdAt}
}`;

export enum Sort {
  NEW = 'NEW',
  TOP = 'TOP',
}

@Injectable({
  providedIn: 'root'
})
export class FeedService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  public postsAvailable = new BehaviorSubject<boolean>(true);
  public posts: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  private activePostList: Sort = Sort.NEW;
  private offset = 0;
  private offsetStep = 10;

  /**
   * Builds the body for a getPost request
   * @param sort
   * @param offset
   * @param first
   */
  private static buildGetPostBody(sort: string, offset: number, first: number = 10) {
    return {
      query: getPostGqlQuery, variables: {
        first,
        offset,
        sort
      }
    };
  }

  /**
   * Returns if the input date is today
   * @param date
   */
  private static dateIsToday(date: Date) {
    date = new Date(date);
    return new Date().setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
  }

  /**
   * Creates a new post
   * @param pContent
   */
  public createPost(pContent: String) {
    const body = {
      query: createPostGqlQuery,
      variables: {
        content: pContent
      }
    };
    return this.createPostRequest(body);
  }

  /**
   * Creates a post with an activity
   * @param pContent
   * @param activityId
   */
  public createPostActivity(pContent: String, activityId: String) {
    const body = {
      query: createPostActivityGqlQuery, variables: {
        content: pContent,
        id: activityId
      }
    };
    return this.createPostRequest(body);
  }

  /**
   * Creates a new post with a given request.
   * @param body
   */
  private createPostRequest(body: { variables: any; query: string }) {
    return this.postGraphql(body, null, 0)
      .pipe(tap(response => {
        if (this.activePostList === Sort.NEW) {
          const updatedPosts = this.posts.getValue();
          updatedPosts.unshift(this.constructPost(response));
          this.posts.next(updatedPosts);
        }
      }));
  }

  /**
   * Upvotes a post
   * @param postId
   */
  public upvote(postId: number): any {
    const body = {
      query: upvotePostGqlQuery, variables: {
        postId
      }
    };

    return this.postGraphql(body);
  }

  /**
   * Downvotes a post
   * @param postId
   */
  public downvote(postId: number): any {
    const body = {
      query: downvotePostGqlQuery, variables: {
        postId
      }
    };

    return this.postGraphql(body);
  }

  /**
   * Deletes a post
   * @param pPostID
   */
  public deletePost(pPostID: number): any {
    const body = {
      query: `mutation($postId: ID!) {
        deletePost(postId: $postId)
      }`, variables: {
        postId: pPostID
      }
    };
    return this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(this.retryRated());
  }

  /**
   * Resets the post list and fetches new posts for the given sorting
   * @param sort
   */
  public getPosts(sort: Sort) {
    this.offset = 0;
    this.postsAvailable.next(true);
    this.posts.next([]);
    return this.http.post(environment.graphQLUrl, FeedService.buildGetPostBody(sort, 0),
      {headers: this.headers})
      .pipe(this.retryRated())
      .subscribe(response => {
        this.posts.next(this.constructAllPosts(response));
        this.activePostList = sort;
      });
  }

  /**
   * Fetches the next posts for the current sorting
   */
  public getNextPosts() {
    this.offset += this.offsetStep;
    const body = FeedService.buildGetPostBody(this.activePostList, this.offset);
    this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(this.retryRated())
      .subscribe(response => {
        const posts = this.constructAllPosts(response);
        const previousPosts = this.posts.getValue();
        for (const post of previousPosts.reverse()) {
          if (!posts.find(p => p.id === post.id)) {
            posts.unshift(post);
          }
        }
        this.posts.next(posts);
        if (posts.length < this.offsetStep) {
          this.postsAvailable.next(false);
        }
      });
  }

  public constructPost(response: any): Post {
    const post = response.data.createPost;
    let profilePicture: string;
    if (post.author.profilePicture) {
      profilePicture = environment.greenvironmentUrl + post.author.profilePicture;
    } else {
      profilePicture = 'assets/images/default-profilepic.svg';
    }
    const author = new Author(post.author.id, post.author.name, post.author.handle, profilePicture);
    const postDate = new Date(Number(post.createdAt));
    let date: string;
    if (FeedService.dateIsToday(postDate)) {
      date = formatDate(postDate, 'HH:mm', 'en-GB');
    } else {
      date = formatDate(postDate, 'dd.MM.yy HH:mm', 'en-GB');
    }
    let activity: Activity;
    if (post.activity) {
      activity = new Activity(
        post.activity.id,
        post.activity.name,
        post.activity.description,
        post.activity.points);
    } else {
      activity = null;
    }

    return new Post(
      post.id,
      post.content,
      post.htmlContent,
      post.upvotes,
      post.downvotes,
      post.userVote,
      post.deletable,
      date,
      author,
      activity);
  }

  public constructAllPosts(response: any): Post[] {
    const posts = new Array<Post>();
    for (const post of response.data.getPosts) {
      let profilePicture: string;
      if (post.author.profilePicture) {
        profilePicture = environment.greenvironmentUrl + post.author.profilePicture;
      } else {
        profilePicture = 'assets/images/default-profilepic.svg';
      }
      const author = new Author(post.author.id, post.author.name, post.author.handle, profilePicture);
      const postDate = new Date(Number(post.createdAt));
      let date: string;
      if (FeedService.dateIsToday(postDate)) {
        date = formatDate(postDate, 'HH:mm', 'en-GB');
      } else {
        date = formatDate(postDate, 'dd.MM.yy HH:mm', 'en-GB');
      }
      let activity: Activity;
      if (post.activity) {
        activity = new Activity(
          post.activity.id,
          post.activity.name,
          post.activity.description,
          post.activity.points);
      } else {
        activity = null;
      }
      posts.push(new Post(
        post.id,
        post.content,
        post.htmlContent,
        post.upvotes,
        post.downvotes,
        post.userVote,
        post.deletable,
        date,
        author,
        activity));
    }
    return posts;
  }
}
