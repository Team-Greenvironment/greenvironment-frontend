import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Http, URLSearchParams, Headers} from '@angular/http';
import { User } from 'src/app/models/user';
import { Actionlist } from 'src/app/models/actionlist';
import { Levellist } from 'src/app/models/levellist';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  actionlist: Actionlist = new Actionlist();
  levellist: Levellist = new Levellist();
  user: User = new User()
  id : string
  profileNotFound : boolean = false;
  constructor(private router: Router,private http: Http) { }
  

  ngOnInit() {
    this.id = this.router.url.substr(this.router.url.lastIndexOf("/") + 1);
    //let url = './graphql'
    let url = 'https://greenvironment.net/graphql'
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
 
    return this.http.post(url, this.buildJson(this.id))
      .subscribe(response => {
        console.log(response.text());
        this.updateUserInfo(response.json());
      }
      );
  }

  public updateUserInfo(response : any){
    if(response.data.getUser != null){
      this.profileNotFound = false;
      this.user.loggedIn = true;
      this.user.userID = response.data.getUser.id;
      this.user.username = response.data.getUser.name;
      this.user.handle = response.data.getUser.handle;
      this.user.points = response.data.getUser.points;
      this.user.level = response.data.getUser.level;
      this.user.friendIDs = response.data.getUser.friends;
    } else{
      this.profileNotFound = true;
    }
  }

  public buildJson(id: string): any {
    const body =  {query: `query($userId: ID) {
      getUser(userId:$userId){
        id
        handle
        name
        profilePicture
        points
        level    
        friendCount
        friends{
          id
        }
        posts{
          content
        }   
      }
    }`, variables: {
        userId: this.id 
      }};
    return body;
  }
}
