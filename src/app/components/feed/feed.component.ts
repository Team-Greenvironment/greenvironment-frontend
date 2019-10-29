import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';

@Component({
  selector: 'home-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass']
})
export class FeedComponent implements OnInit {

  viewNew: boolean = true
  viewMostLiked: boolean = false

  feedNew: Array<Post>
  feedMostLiked: Array<Post>

  parentSelectedPostList: Array<Post>

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json())
      console.log(response)
      this.parentSelectedPostList = this.feedNew
      this.feedMostLiked = this.feedNew
    })
  }

  createPost(pContent: string){
    this.feedService.createPost(pContent)
    console.log(pContent)
  }

  showNew() {
    this.feedNew = this.feedService.getAllPosts()
    this.viewNew = true
    this.viewMostLiked = false
    this.parentSelectedPostList = this.feedNew
  }

  showMostLiked() {
    this.feedMostLiked = this.feedService.getAllPosts()
    this.viewNew = false
    this.viewMostLiked = true
    this.parentSelectedPostList = this.feedMostLiked
  }

}
