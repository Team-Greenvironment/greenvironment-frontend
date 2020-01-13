import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from 'src/app/models/post';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  posts: Array<Post>;

  constructor(private http: Http) { }

  public createPost(pContent: String) {
    const url = environment.graphQLUrl;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const body = {query: `mutation($content: String!) {
        createPost(content: $content) {id}
      }`, variables: {
          content: pContent
      }};

    this.http.post(url, body).subscribe(response => {
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

  public getAllPosts(): Array<Post> {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.http.post(url, this.getBodyForGetAllPosts())
    .subscribe(response => {
        this.posts = this.renderAllPosts(response.json());
      });
    return this.posts;
  }

  public getAllPostsRaw(): any {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    return this.http.post(environment.graphQLUrl, this.getBodyForGetAllPosts());
  }

  getBodyForGetAllPosts() {
    const body =  {query: `{
        getPosts (first: 1000, offset: 0) {
          id,
          content,
          htmlContent,
          upvotes,
          downvotes,
          userVote,
          deletable
          author{
            name,
            handle,
            id},
          createdAt}
      }`, variables: {
      }};
      return body;
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

      posts.push(new Post(id, content, htmlContent, upvotes, downvotes, userVote, deletable, date, author));
    }
    return posts;
  }
}
