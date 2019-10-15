import { Component, OnInit } from '@angular/core';
import { RegisterService } from './services/register/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [RegisterService]
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
