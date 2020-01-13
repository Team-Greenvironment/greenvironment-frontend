import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  public posts: BehaviorSubject<Post[]> = new BehaviorSubject(new Array());
  public newPosts: BehaviorSubject<Post[]> = new BehaviorSubject(new Array());
  public mostLikedPosts: BehaviorSubject<Post[]> = new BehaviorSubject(new Array());

  constructor(private http: Http) { }

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
            id},
          createdAt}
      }`, variables: {
          content: pContent
      }};
      return this.http.post(environment.graphQLUrl, body).subscribe(response => {
        const updatedposts = this.newPosts.getValue();
        updatedposts.unshift(this.renderPost(response.json()));
        this.newPosts.next(updatedposts);
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
            id},
          createdAt}
      }`, variables: {
          content: pContent,
          id: activityId
      }};
      return this.http.post(environment.graphQLUrl, body).subscribe(response => {
        const updatedposts = this.newPosts.getValue();
        updatedposts.unshift(this.renderPost(response.json()));
        this.newPosts.next(updatedposts);
      });
  }

  public upvote(pPostID: number): any {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: UPVOTE) {
          post{userVote upvotes downvotes}
        }
      }`, variables: {
          postId: pPostID
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

  public getNewPosts() {
    if (this.newPosts.getValue().length === 0) {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJsonNew())
      .subscribe(response => {
        this.newPosts.next(this.renderAllPosts(response.json()));
        this.posts.next(this.newPosts.getValue());
      });
    } else {this.posts.next(this.newPosts.getValue()); }
  }

  public getMostLikedPosts() {
    if (this.mostLikedPosts.getValue().length === 0) {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      this.http.post(environment.graphQLUrl, this.buildJsonMostLiked())
      .subscribe(response => {
        this.mostLikedPosts.next(this.renderAllPosts(response.json()));
        this.posts.next(this.mostLikedPosts.getValue());
      });
    } else {this.posts.next(this.mostLikedPosts.getValue()); }
  }

  buildJsonNew() {
    const body =  {query: `{
        getPosts (first: 1000, offset: 0) {
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
            id},
          createdAt}
      }`, variables: {
      }};
      return body;
  }

  buildJsonMostLiked() {
    const body =  {query: `{
        getPosts (first: 1000, offset: 0, sort: TOP) {
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
            id},
          createdAt}
      }`, variables: {
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
    const author = new Author(post.author.id, post.author.name, post.author.handle);
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
      const author = new Author(post.author.id, post.author.name, post.author.handle);
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
