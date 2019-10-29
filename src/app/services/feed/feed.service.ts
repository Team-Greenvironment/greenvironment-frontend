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

  public createPost(pContent: String){
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($content: String!) {
        createPost(content: $content) {id}
      }`, variables: {
          content: pContent
      }}
 
    this.http.post(url, body).subscribe(response => {
        console.log(response.text())})
  }

  public createPost2(pContent: String){
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `query{
        getSelf {name}
      }`}
 
    this.http.post(url, body).subscribe(response => {
        console.log(response.text())})
  }

  public upvote(pPostID: number): any {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: UPVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    return this.http.post(url, body)
  }

  public downvote(pPostID: number): any {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: DOWNVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    return this.http.post(url, body)
  }

  public getAllPosts(): Array<Post> {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetAllPosts())
    .subscribe(response => {
        this.posts = this.renderAllPosts(response.json())
        console.log(response)
      });
    return this.posts
  }

  public getAllPostsRaw(): any {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    return this.http.post(url, this.getBodyForGetAllPosts())
  }

  getBodyForGetAllPosts() {
    const body =  {query: `query {
        getPosts (first: 1000, offset: 0) {id, content, htmlContent, upvotes, downvotes, author{name, handle, id}, createdAt}
      }`
      }

      return body
  }

  public renderAllPosts(pResponse: any): Array<Post> {
    let posts = new Array<Post>()
    for(let post of pResponse.data.getPosts) {
      let id: number = post.id
      let content: string = post.content
      let htmlContent: string = post.htmlContent
      let upvotes: number = post.upvotes
      let downvotes: number = post.downvotes
      let author = new Author(post.author.id, post.author.name, post.author.handle)
      let temp = new Date(Number(post.createdAt))
      let date = temp.toDateString()

      posts.push(new Post(id, content, htmlContent, upvotes, downvotes, date, author))
    }
    return posts
  }
}
