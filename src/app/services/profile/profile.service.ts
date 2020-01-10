import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from 'src/app/models/post';
import { Author } from 'src/app/models/author';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public proflile:Subject<any> = new Subject();

  constructor(private http: Http) { }

  public getUserData(userId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    //return this.renderProfile(this.http.post(environment.graphQLUrl, this.buildGetProfileJson(userId)));
    this.http.post(environment.graphQLUrl, this.buildGetProfileJson(userId)).subscribe(result => {
      //push onto subject
      this.proflile.next(this.renderProfile(result.json()));
      return this.proflile;
    });
  }

  public getUserDataBySelfId(userId: string, selfId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    //return this.renderProfile(this.http.post(environment.graphQLUrl, this.buildGetProfileJson(userId)));
    this.http.post(environment.graphQLUrl, this.buildGetProfileJsonBySelfId(userId, selfId)).subscribe(result => {
      //push onto subject
      this.proflile.next(this.renderProfile(result.json()));
      return this.proflile;
    });
  }


  public buildGetProfileJson(id: string): any {
    const body =  {query: `query($userId: ID) {
      getUser(userId:$userId){
        id
        handle
        name
        profilePicture
        points
        level
        friendCount
        groupCount
        joinedAt
        friends{
          id
        }
        posts{
          id,
          content,
          htmlContent,
          upvotes,
          downvotes,
          author{
            name,
            handle,
            id},
          createdAt
        }
      }
    }`, variables: {
        userId: id
      }};
    return body;
  }

  public buildGetProfileJsonBySelfId(id: string, selfId: string): any {
    const body =  {query: `query($userId: ID, $selfId: ID!) {
      getUser(userId:$userId){
        id
        handle
        name
        profilePicture
        points
        level
        friendCount
        groupCount
        joinedAt
        friends{
          id
        }
        posts{
          id,
          content,
          htmlContent,
          upvotes,
          downvotes,
          userVote(userId: $selfId),
          deletable(userId: $selfId)
          author{
            name,
            handle,
            id},
          createdAt
        }
      }
    }`, variables: {
        userId: id,
        selfId: selfId
      }};
    return body;
  }

  public renderProfile(response: any): User {
    console.log(response);
    const posts = new Array<Post>();
    const profile = new User();
    if (response.data.getUser != null) {

      profile.userID = response.data.getUser.id;
      profile.username = response.data.getUser.name;
      profile.handle = response.data.getUser.handle;
      profile.points = response.data.getUser.points;
      profile.level = response.data.getUser.level;
      profile.friendCount = response.data.getUser.friendCount;
      profile.groupCount = response.data.getUser.groupCount;
      const temp = new Date(Number(response.data.getUser.joinedAt));
      const date = temp.toLocaleString('en-GB');
      profile.joinedAt = date;
      for (const post of response.data.getUser.posts) {
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
      profile.posts = posts;
      console.log(profile);
      return profile;
    }
    return null;
  }
}
