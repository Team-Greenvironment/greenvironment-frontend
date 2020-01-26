import {Component, HostBinding, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DatasharingService} from '../../services/datasharing.service';
import {RequestService} from '../../services/request/request.service';
import {SettingsService} from '../../services/settings/settings.service';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {User} from 'src/app/models/user';
import {OverlayContainer} from '@angular/cdk/overlay';
import {LoginService} from '../../services/login/login.service';

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
    private requestService: RequestService,
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.overlay = overlayContainer.getContainerElement();
  }

  loggedIn = false;
  userId: number;
  username: string;
  user: User;
  level: string;
  points: number;
  profileUrl = '/profile/1';

  darkModeButtonChecked = false;
  lighttheme = true;
  overlay;

  navLinksLoggedIn = [
    {path: '', label: 'Home'},
    {path: this.profileUrl, label: 'Profile'},
    {path: '/about', label: 'About'},
    {path: '/imprint', label: 'Imprint'},
  ];
  navLinks = [
    {path: '', label: 'Home'},
    {path: '/about', label: 'About'},
    {path: '/imprint', label: 'Imprint'},
  ];

  @HostBinding('class') componentCssClass;

  ngOnInit() {
    if (this.lighttheme && this.getThemeFromLocalStorage() === 'dark-theme') {
      this.toggleTheme();
      this.darkModeButtonChecked = true;
    }
    this.data.currentUser.subscribe(user => {
      this.user = user;
      this.loggedIn = user.loggedIn;
      this.userId = user.userID;
      this.username = user.username;
      this.level = user.levelName;
      this.points = user.points;
      this.profileUrl = '/profile/' + this.userId;
      if (this.user.darkmode === true && this.lighttheme) {
        this.toggleTheme();
        this.darkModeButtonChecked = true;
        // IF user activated darkmode and logged in after that
      } else if (this.user.loggedIn && !this.user.darkmode && !this.lighttheme) {
        this.settingsService.setDarkModeActive(true);
        this.darkModeButtonChecked = true;
      }
      this.updateLinks();
    });
  }

  /**
   * Returns the saved theme from the local storage
   */
  private getThemeFromLocalStorage(): string {
    return localStorage.getItem('theme');
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
      {path: '', label: 'Home'},
      {path: this.profileUrl, label: 'Profile'},
      {path: '/about', label: 'About'},
      {path: '/imprint', label: 'Imprint'},
    ];
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
    localStorage.setItem('theme', theme);
  }

  /**
   * Logs out
   */
  logout() {
    this.loginService.logout().subscribe(() => {
      this.loggedIn = false;
      const user = new User();
      user.loggedIn = false;
      this.data.currentUser.next(user);
      this.router.navigate(['login']);
    });
  }

  /**
   * Accepts a request
   * @param id
   */
  acceptRequest(id: number) {
    this.requestService.acceptRequest(id).subscribe(response => {
      for (let i = 0; i < this.user.receivedRequests.length; i++) {
        if (this.user.receivedRequests[i].senderUserID === id) {
          this.user.receivedRequests.splice(i, 1);
          return;
        }
      }
    });
  }

  /**
   * Denys a request
   * @param id
   */
  denyRequest(id: number) {
    this.requestService.denyRequest(id).subscribe(() => {
      for (let i = 0; i < this.user.receivedRequests.length; i++) {
        if (this.user.receivedRequests[i].senderUserID === id) {
          this.user.receivedRequests.splice(i, 1);
          return;
        }
      }
    });
  }
}
