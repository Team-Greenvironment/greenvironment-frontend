import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from 'src/app/models/post';
import { Author } from 'src/app/models/author';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  posts: Array<Post>

  constructor(private http: Http) { }

  public voteUp(pPostID: number): void {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: number) {
        vote(postId: $postId, type: UPVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    this.http.post(url, body)
  }

  public voteDown(pPostID: number): void {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: number) {
        vote(postId: $postId, type: DOWNVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    this.http.post(url, body)
  }

  public getAllPosts(): Array<Post> {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetAllChats())
    .subscribe(response => {
        this.posts = this.renderAllPosts(response.json())
      });
    return this.posts
  }

  getBodyForGetAllChats() {
    const body =  {query: `query {
        getPosts (first: 1000, offset: 0) {id, content, upvotes, downvotes, author{name, handle, id}, createdAt}
      }`
      }

      return body
  }

  renderAllPosts(pResponse: any): Array<Post> {
    let posts = new Array<Post>()
    for(let post of pResponse.data.getPosts) {
      let id: number = post.id
      let content: string = post.content
      let upvotes: number = post.upvotes
      let downvotes: number = post.downvotes
      let author = new Author(post.author.id, post.author.name, post.author.handle)
      let date = post.createdAt

      posts.push(new Post(id, content, upvotes, downvotes, date, author))
    }
    return posts
  }
}
