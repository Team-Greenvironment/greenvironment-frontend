import {Author} from './author';
import {Activity} from './activity';
import { environment } from 'src/environments/environment';

export class Post {
  id: number;
  content: string;
  htmlContent: string;
  date: string;
  upvotes: number;
  downvotes: number;
  userVote: string;
  deletable: boolean;
  author: Author;
  activity: Activity;
  mediaUrl: string;
  mediaType: 'VIDEO' | 'IMAGE';

  constructor(
    id: number,
    content: string,
    htmlContent: string,
    upvotes: number,
    downvotes: number,
    userVotes: string,
    deletable: boolean,
    date: string,
    author: Author,
    activity: Activity,
    media?: {url: string, type: 'VIDEO' | 'IMAGE'},
  ) {
    this.id = id;
    this.content = content;
    this.htmlContent = htmlContent;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.userVote = userVotes;
    this.deletable = deletable;
    this.date = date;
    this.author = author;
    this.activity = activity;
    if (media) {
      this.mediaUrl = environment.greenvironmentUrl + media.url;
      this.mediaType = media.type;
    }
  }
}
