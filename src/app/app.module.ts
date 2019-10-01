import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

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

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

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
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
