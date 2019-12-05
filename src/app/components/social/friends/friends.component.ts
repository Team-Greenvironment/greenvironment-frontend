import { Component, OnInit } from '@angular/core';
import { DatasharingService } from 'src/app/services/datasharing.service';
import { Http } from '@angular/http';
import { FriendInfo } from 'src/app/models/friendinfo';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'social-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.sass']
})
export class FriendsComponent implements OnInit {

  friendIDs: number[] = [29, 27, 30, 31]
  friends = new Array<FriendInfo>() //= ["Friend 1", "Friend 2", "Friend 3", "Friend 4", "Friend 5", "Friend 6"]

  constructor(private data: DatasharingService, private http: Http, private router: Router) { }

  ngOnInit() {
    //this.data.currentUserInfo.subscribe(user => {
    //  this.friendIDs = user.friendIDs})
    this.getFriendsNames()
  }

  getFriendsNames() {
    for(let id of this.friendIDs) {
      let url = environment.graphQLUrl
      let headers = new Headers();
      headers.set('Content-Type', 'application/json');
  
      this.http.post(url, this.buildJson(id))
        .subscribe(response => {this.readOutFriendsNames(id, response.json())})
      }
  }

  readOutFriendsNames(pId: number, pResponse : any) {
    this.friends.push(new FriendInfo(pId, pResponse.data.getUser.name))
  }

  buildJson(pId: number): any {
    const body =  {query: `query($userId: ID) {
      getUser(userId:$userId) {
        name
      }
    }`, variables: {
        userId: pId 
      }}

    return body
  }

  public showFriendProfile(pFriend: FriendInfo){
    this.router.navigate(['profile/' + pFriend.id])
  }

}
