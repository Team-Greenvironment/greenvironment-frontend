import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AppScaffoldComponent } from './components/app-scaffold/app-scaffold.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/social/friends/friends.component';
import { FeedComponent } from './components/feed/feed.component';
import { HomeComponent } from './components/home/home.component';
import { SocialComponent } from './components/social/social.component';
import { GroupsComponent } from './components/social/groups/groups.component';
import { ChatmanagerComponent } from './components/chatmanager/chatmanager.component';
import { ChatlistComponent } from './components/chatlist/chatlist.component';
import { PostlistComponent } from './components/feed/postlist/postlist.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { AboutComponent } from './components/about/about.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'imprint', component: ImprintComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DocumentComponent,
    RegisterComponent,
    LoginComponent,
    AppScaffoldComponent,
    ChatComponent,
    FriendsComponent,
    FeedComponent,
    HomeComponent,
    SocialComponent,
    GroupsComponent,
    ChatmanagerComponent,
    ChatlistComponent,
    PostlistComponent,
    ImprintComponent,
    AboutComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SocketIoModule.forRoot(config),
    GraphQLModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
