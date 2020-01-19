import {Author} from './author';
import {Activity} from './activity';

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
    activity: Activity
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
  }
}
