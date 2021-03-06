import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {ChatComponent} from './components/chat/chat.component';
import {FriendsComponent} from './components/social/friends/friends.component';
import {FeedComponent} from './components/feed/feed.component';
import {HomeComponent} from './components/home/home.component';
import {SocialComponent} from './components/social/social.component';
import {DialogCreateGroupComponent, GroupsComponent} from './components/social/groups/groups.component';
import {DialogCreateEventComponent, GroupComponent} from './components/group/group.component';
import {ChatmanagerComponent} from './components/chatmanager/chatmanager.component';
import {ChatlistComponent} from './components/chatlist/chatlist.component';
import {PostlistComponent} from './components/feed/postlist/postlist.component';
import {HttpClientModule} from '@angular/common/http';
import {ProfileComponent} from './components/profile/profile.component';
import {DialogFileUploadComponent} from './components/profile/fileUpload/fileUpload.component';
import {DialogGroupFileUploadComponent} from './components/group/fileUpload/fileUpload.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {AboutComponent} from './components/about/about.component';
import {ChatcontactsComponent} from './components/chatmanager/chatcontacts/chatcontacts.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {UserlistComponent} from './components/userlist/userlist.component';

import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {FlexLayoutModule} from '@angular/flex-layout';
import {MainNavigationComponent} from './components/main-navigation/main-navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import {SearchComponent} from './components/search/search.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule, MatNativeDateModule, MatProgressBarModule} from '@angular/material/';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {LightboxModule} from 'ngx-lightbox';
import { AdminpageComponent } from './components/adminpage/adminpage.component';


const config: SocketIoConfig = {url: 'http://localhost:4444', options: {}};

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profile/:id', component: ProfileComponent},
  {path: 'group/:id', component: GroupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'about', component: AboutComponent},
  {path: 'imprint', component: ImprintComponent},
  {path: 'admin', component: AdminpageComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    FriendsComponent,
    FeedComponent,
    HomeComponent,
    SocialComponent,
    GroupsComponent,
    ChatmanagerComponent,
    ChatlistComponent,
    ChatcontactsComponent,
    PostlistComponent,
    ImprintComponent,
    AboutComponent,
    ProfileComponent,
    MainNavigationComponent,
    SearchComponent,
    DialogCreateGroupComponent,
    GroupComponent,
    DialogCreateEventComponent,
    UserlistComponent,
    DialogFileUploadComponent,
    DialogGroupFileUploadComponent,
    AdminpageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    InfiniteScrollModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(
      appRoutes
    ),
    MatIconModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatTabsModule,
    LayoutModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    OverlayModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatSortModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    LightboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatGridListModule,
  ],
  entryComponents: [
    DialogCreateGroupComponent,
    DialogCreateEventComponent,
    DialogFileUploadComponent,
    DialogGroupFileUploadComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'logo', sanitizer.bypassSecurityTrustResourceUrl('assets/images/gv-logo-white.svg'));
    iconRegistry.addSvgIcon(
      'logo_green', sanitizer.bypassSecurityTrustResourceUrl('assets/images/gv-logo-flat.svg'));
  }
}
