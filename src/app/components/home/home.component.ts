import { Component, OnInit } from '@angular/core';
import { DatasharingService } from 'src/app/services/datasharing.service';
import { FeedService } from 'src/app/services/feed/feed.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  loggedIn: boolean

  constructor(private data: DatasharingService, private feedService: FeedService) { }

  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.loggedIn = user.loggedIn;
    })
    this.feedService.getAllPosts()
  }

}
