import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from 'src/app/models/post';
import {Author} from 'src/app/models/author';
import {environment} from 'src/environments/environment';
import {Activity} from 'src/app/models/activity';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {BaseService} from '../base.service';

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

  constructor(private http: HttpClient) {
    super();
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
    return this.http.post(environment.graphQLUrl, body, {headers: this.headers})
      .pipe(tap(response => {
        if (this.activePostList === Sort.NEW) {
          const updatedPosts = this.posts.getValue();
          updatedPosts.push(this.constructPost(response));
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

    return this.http.post(environment.graphQLUrl, body, {headers: this.headers});
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

    return this.http.post(environment.graphQLUrl, body, {headers: this.headers});
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

    return this.http.post(environment.graphQLUrl, body, {headers: this.headers});
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
      {headers: this.headers}).subscribe(response => {
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
      .subscribe(response => {
        const posts = this.constructAllPosts(response);
        const updatedPostList = this.posts.getValue().concat(posts);
        this.posts.next(updatedPostList);
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
    const temp = new Date(Number(post.createdAt));
    const date = temp.toLocaleString('en-GB');
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
      const temp = new Date(Number(post.createdAt));
      const date = temp.toLocaleString('en-GB');
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
