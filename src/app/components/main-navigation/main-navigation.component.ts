import { Component, OnInit, HostBinding  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DatasharingService } from '../../services/datasharing.service';
import { RequestService } from '../../services/request/request.service';
import { SettingsService } from '../../services/settings/settings.service';
import { environment } from 'src/environments/environment';
import { Levellist } from 'src/app/models/levellist';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.sass']
})
export class MainNavigationComponent implements OnInit {

  constructor(
    public overlayContainer: OverlayContainer,
    private data: DatasharingService,
    private settingsService: SettingsService,
    private requestservice: RequestService,
    private breakpointObserver: BreakpointObserver,
    private http: Http, private router: Router,
  ) {
    this.overlay = overlayContainer.getContainerElement();
  }
  loggedIn = false;
  userId: number;
  username: string;
  user: User;
  levellist: Levellist = new Levellist();
  level: string;
  points: number;
  profileUrl = '/profile/1';

  darkModeButtonChecked = false;
  lighttheme = true;
  overlay;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  navLinksLoggedIn = [
    { path: '', label: 'Home' },
    { path: this.profileUrl, label: 'Profile' },
    { path: '/about', label: 'About' },
    { path: '/imprint', label: 'Imprint' },
  ];
  navLinks = [
    { path: '', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/imprint', label: 'Imprint' },
    { path: '/login', label: 'Login' },
  ];

  @HostBinding('class') componentCssClass;
  ngOnInit() {
    this.data.currentUserInfo.subscribe(user => {
      this.user = user;
      this.loggedIn = user.loggedIn;
      this.userId = user.userID;
      this.username = user.username;
      this.level = this.levellist.getLevelName(user.level);
      this.points = user.points;
      this.profileUrl = '/profile/' + this.userId;
      if (this.user.darkmode === true && this.lighttheme) {
        this.toggleTheme();
        this.darkModeButtonChecked = true;
      } else if (!this.user.darkmode && !this.lighttheme) {
        this.settingsService.setDarkModeActive(true);
      }
      this.updateLinks();
    });
  }

  toggleTheme() {
    if (this.overlay.classList.contains('dark-theme')) {
        this.overlay.classList.remove('dark-theme');
        this.overlay.classList.add('light-theme');
        this.onSetTheme('light-theme');
        this.lighttheme = true;
        this.settingsService.setDarkModeActive(false);
    } else if (this.overlay.classList.contains('light-theme')) {
        this.overlay.classList.remove('light-theme');
        this.overlay.classList.add('dark-theme');
        this.onSetTheme('dark-theme');
        this.lighttheme = false;
        this.settingsService.setDarkModeActive(true);
    } else {
        this.overlay.classList.add('dark-theme');
        this.onSetTheme('dark-theme');
        this.lighttheme = false;
        this.settingsService.setDarkModeActive(true);
    }
  }

  updateLinks() {
    this.navLinksLoggedIn = [
      { path: '', label: 'Home' },
      { path: this.profileUrl, label: 'Profile' },
      { path: '/about', label: 'About' },
      { path: '/imprint', label: 'Imprint' },
    ];
  }
  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
  logout() {
    const url = environment.graphQLUrl;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const body = {query: `mutation {
        logout
      }`};
    this.http.post(url, body).subscribe(response => {
        console.log(response.text()); });
    this.loggedIn = false;
    const user = new User();
    user.loggedIn = false;
    this.data.changeUserInfo(user);
    this.router.navigate(['login']);
  }

  acceptRequest(id: number) {
    console.log('try to accept request from id: ' + id);
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.requestservice.buildJsonAcceptRequest(id))
      .subscribe(response => {
        console.log(response);
        for (let i = 0; i < this.user.receivedRequests.length; i++) {
          if (this.user.receivedRequests[i].senderUserID === id) {
            this.user.receivedRequests.splice(i, 1);
            return;
          }
        }
      });
  }

  denyRequest(id: number) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    this.http.post(environment.graphQLUrl, this.requestservice.buildJsonDenyRequest(id))
      .subscribe(response => {
        console.log(response);
        for (let i = 0; i < this.user.receivedRequests.length; i++) {
          if (this.user.receivedRequests[i].senderUserID === id) {
            this.user.receivedRequests.splice(i, 1);
            return;
          }
        }
      });
  }
}
