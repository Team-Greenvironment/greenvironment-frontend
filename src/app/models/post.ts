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

  // TODO: constructor properties need normal names
  constructor(
    pId: number,
    pContent: string,
    pHtmlContent: string,
    pUpvotes: number,
    pDownvotes: number,
    pUserVote: string,
    pDeletable: boolean,
    pDate: string,
    pAuthor: Author,
    pactivity: Activity
  ) {
    this.id = pId;
    this.content = pContent;
    this.htmlContent = pHtmlContent;
    this.upvotes = pUpvotes;
    this.downvotes = pDownvotes;
    this.userVote = pUserVote;
    this.deletable = pDeletable;
    this.date = pDate;
    this.author = pAuthor;
    this.activity = pactivity;
  }
}
