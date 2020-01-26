import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from 'src/app/models/post';
import {Author} from 'src/app/models/author';
import {environment} from 'src/environments/environment';
import {User} from 'src/app/models/user';
import {Subject} from 'rxjs';
import {Activity} from 'src/app/models/activity';
import {BaseService} from '../base.service';
import {FeedService} from 'src/app/services/feed/feed.service';

const graphqlGetProfileQuery = `query($userId: ID) {
  getUser(userId:$userId){
    id
    handle
    name
    profilePicture
    points
    level {
      name
      levelNumber
    }
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
      media {url, type},
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
      createdAt
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {

  constructor(http: HttpClient, private feedService: FeedService) {
    super(http);
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
    this.postGraphql(ProfileService.buildGetProfileBody(userId))
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
      profile.posts = this.feedService.constructAllPosts(response.data.getUser.posts);
      return profile;
    }
    return null;
  }
}
