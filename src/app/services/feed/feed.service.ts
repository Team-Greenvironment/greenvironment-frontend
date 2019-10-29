import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from 'src/app/models/post';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  posts: Array<Post>

  constructor(private http: Http) { }

  public createPost(pContent: String){
    let url = environment.graphQLUrl
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

  public upvote(pPostID: number): void {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: UPVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    this.http.post(url, body).subscribe(response => {
        console.log(response.text())})
  }

  public downvote(pPostID: number): void {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const body = {query: `mutation($postId: ID!) {
        vote(postId: $postId, type: DOWNVOTE)
      }`, variables: {
          postId: pPostID
      }}
 
    this.http.post(url, body).subscribe(response => {
        console.log(response.text())})
  }

  public getAllPosts(): Array<Post> {
    let url = 'https://greenvironment.net/graphql'
 
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
 
    this.http.post(url, this.getBodyForGetAllChats())
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
 
    return this.http.post(url, this.getBodyForGetAllChats())
  }

  getBodyForGetAllChats() {
    const body =  {query: `query {
        getPosts (first: 1000, offset: 0) {id, content, upvotes, downvotes, author{name, handle, id}, createdAt}
      }`
      }

      return body
  }

  public renderAllPosts(pResponse: any): Array<Post> {
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
