import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from 'src/app/models/post';
import {Author} from 'src/app/models/author';
import {environment} from 'src/environments/environment';
import {User} from 'src/app/models/user';
import {Subject} from 'rxjs';
import {Activity} from 'src/app/models/activity';
import {BaseService} from '../base.service';

const graphqlGetProfileQuery = `query($userId: ID) {
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
        profilePicture
        id},
      createdAt
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public proflile: Subject<any> = new Subject();

  /**
   * Builds the request body of a getProfile request
   * @param id
   */
  private static buildGetProfileBody(id: string): any {
    return {
      query: graphqlGetProfileQuery,
      variables: {
        userId: id,
      }
    };
  }

  /**
   * Returns the data for the specified user.
   * @param userId
   */
  public getUserData(userId: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, ProfileService.buildGetProfileBody(userId))
      .pipe(this.retryRated())
      .subscribe(result => {
      this.proflile.next(this.getProfileData(result));
      return this.proflile;
    });
  }

  /**
   * Returns a userinstance filled with profile data
   * @param response
   */
  public getProfileData(response: any): User {
    const posts = new Array<Post>();
    const profile = new User();
    if (response.data.getUser) {
      profile.assignFromResponse(response.data.getUser);
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
        let profilePicture: string;
        if (post.author.profilePicture) {
          profilePicture = environment.greenvironmentUrl + post.author.profilePicture;
        } else {
          profilePicture = 'assets/images/default-profilepic.svg';
        }
        const author = new Author(post.author.id, post.author.name, post.author.handle, profilePicture);
        const ptemp = new Date(Number(post.createdAt));
        const pdate = ptemp.toLocaleString('en-GB');
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

        // tslint:disable-next-line: max-line-length
        posts.push(new Post(id, content, htmlContent, upvotes, downvotes, userVote, deletable, pdate, author, activity));
      }
      profile.posts = posts;
      return profile;
    }
    return null;
  }
}
