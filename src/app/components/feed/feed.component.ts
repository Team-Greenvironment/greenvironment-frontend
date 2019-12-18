import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FeedService } from 'src/app/services/feed/feed.service';
import { Actionlist } from 'src/app/models/actionlist';

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

  actionlist: Actionlist = new Actionlist();

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json())
      this.parentSelectedPostList = this.feedNew
      this.feedMostLiked = this.feedNew
      console.log(this.feedNew)
    })
  }

  createPost(pElement){
    this.feedService.createPost(pElement.value)
    pElement.value = ""
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json())
      this.parentSelectedPostList = this.feedNew
      this.feedMostLiked = this.feedNew})
  }

  showNew() {
    console.log("showNew()")
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedNew = this.feedService.renderAllPosts(response.json())
      this.parentSelectedPostList = this.feedNew})
    this.viewNew = true
    this.viewMostLiked = false
  }

  showMostLiked() {
    console.log("showMostLiked()")
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.feedMostLiked = this.feedService.renderAllPosts(response.json())
      this.parentSelectedPostList = this.feedMostLiked})
    this.viewNew = false
    this.viewMostLiked = true
  }

  
  refresh($event) {
    this.feedService.getAllPostsRaw().subscribe(response => {
      this.parentSelectedPostList = this.feedService.renderAllPosts(response.json())
      console.log("Refresh")
    })
  }

}
