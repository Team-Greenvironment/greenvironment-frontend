import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/post';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';
import { Activity } from 'src/app/models/activity';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  public newPostsAvailable = new BehaviorSubject<boolean>(true);
  public topPostsAvailable = new BehaviorSubject<boolean>(true);
  public posts: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  public newPosts: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  public mostLikedPosts: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  private activePostList = 'NEW';
  private mostLikedOffset = 0;
  private newOffset = 0;

  constructor(private http: HttpClient) { }

  public createPost(pContent: String) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($content: String!) {
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
      }`, variables: {
          content: pContent
      }};
      return this.http.post(environment.graphQLUrl, body).subscribe(response => {
        const updatedposts = this.newPosts.getValue();
        updatedposts.unshift(this.renderPost(response));
        this.newPosts.next(updatedposts);
        this.setPost('NEW');
      });
  }

  public createPostActivity(pContent: String, activityId: String) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($content: String!, $id: ID) {
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
      }`, variables: {
          content: pContent,
          id: activityId
      }};
      return this.http.post(environment.graphQLUrl, body).subscribe(response => {
        const updatedposts = this.newPosts.getValue();
        updatedposts.unshift(this.renderPost(response));
        this.newPosts.next(updatedposts);
        this.setPost('NEW');
      });
  }

  public upvote(postId: number): any {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: UPVOTE) {
          post{userVote upvotes downvotes}
        }
      }`, variables: {
          postId
      }};

    return this.http.post(environment.graphQLUrl, body);
  }

  public downvote(pPostID: number): any {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: DOWNVOTE) {
          post{userVote upvotes downvotes}
        }
      }`, variables: {
          postId: pPostID
      }};

    return this.http.post(environment.graphQLUrl, body);
  }

  public deletePost(pPostID: number): any {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($postId: ID!) {
        deletePost(postId: $postId)
      }`, variables: {
          postId: pPostID
      }};

    return this.http.post(environment.graphQLUrl, body);
  }

  public getPosts(sort: string) {
    if ((sort === 'NEW' && this.newPosts.getValue().length === 0) ||
    (sort === 'TOP' && this.mostLikedPosts.getValue().length === 0)) {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJson(sort, 0))
      .subscribe(response => {
        if (sort === 'NEW') {
          this.newPosts.next(this.renderAllPosts(response));
        } else if (sort === 'TOP') {
          this.mostLikedPosts.next(this.renderAllPosts(response));
        }
        this.setPost(sort);
      });
    } this.setPost(sort);
  }

  public getNextPosts() {
    if (this.activePostList === 'NEW' && this.newPostsAvailable) {
      this.newOffset += 10;
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJson(this.activePostList, this.newOffset))
      .subscribe(response => {
        let updatedposts = this.newPosts.getValue();
        updatedposts = updatedposts.concat(this.renderAllPosts(response));
        if (this.renderAllPosts(response).length < 1) {
          this.newPostsAvailable.next(false);
        }
        this.newPosts.next(updatedposts);
        this.setPost('NEW');
      });
    } else if (this.activePostList === 'TOP' && this.topPostsAvailable) {
      this.mostLikedOffset += 10;
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJson(this.activePostList, this.mostLikedOffset))
      .subscribe(response => {
        let updatedposts = this.mostLikedPosts.getValue();
        updatedposts = updatedposts.concat(this.renderAllPosts(response));
        if (this.renderAllPosts(response).length < 1) {
          this.topPostsAvailable.next(false);
        }
        this.mostLikedPosts.next(updatedposts);
        this.setPost('TOP');
      });
    }
  }

  setPost(sort: string) {
    this.activePostList = sort;
    if (sort === 'NEW') {
      this.posts.next(this.newPosts.getValue());
    } else if (sort === 'TOP') {
      this.posts.next(this.mostLikedPosts.getValue());
    }
  }

  buildJson(sort: string, offset: number) {
    const body =  {query: `query($offset: Int, $sort: SortType){
        getPosts (first: 10, offset: $offset, sort: $sort) {
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
      }`, variables: {
        offset,
        sort
      }};
      return body;
  }

  public renderPost(response: any): Post {
    const post = response.data.createPost;
    const id: number = post.id;
    const content: string = post.content;
    const htmlContent: string = post.htmlContent;
    const upvotes: number = post.upvotes;
    const downvotes: number = post.downvotes;
    const userVote: string = post.userVote;
    const deletable: boolean = post.deletable;
    let profilePicture: string;
      if (post.author.profilePicture) {
        profilePicture = environment.greenvironmentUrl + post.author.profilePicture;
      } else {
        profilePicture = 'assets/images/account_circle-24px.svg';
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
      } else { activity = null; }

    return new Post(id, content, htmlContent, upvotes, downvotes, userVote, deletable, date, author, activity);
  }

  public renderAllPosts(pResponse: any): Array<Post> {
    const posts = new Array<Post>();
    // let options = {year: 'numeric', month: 'short', day: 'numeric', hour: '' }
    for (const post of pResponse.data.getPosts) {
      const id: number = post.id;
      const content: string = post.content;
      const htmlContent: string = post.htmlContent;
      const upvotes: number = post.upvotes;
      const downvotes: number = post.downvotes;
      const userVote: string = post.userVote;
      const deletable: boolean = post.deletable;
      let profilePicture: string;
      if (post.author.profilePicture) {
        profilePicture = environment.greenvironmentUrl + post.author.profilePicture;
      } else {
        profilePicture = 'assets/images/account_circle-24px.svg';
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
      } else { activity = null; }
      posts.push(new Post(id, content, htmlContent, upvotes, downvotes, userVote, deletable, date, author, activity));
    }
    return posts;
  }
}
