import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register/register.service';
import {Registration} from '../../models/registration';

@Component({
  selector: 'registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})/*
export class RegisterComponent implements OnInit {
  registration: Registration
 
  constructor(private registerService: RegisterService) {}

  onClickSubmit(pUsername: string, pEmail: string, pPasswordHash: string) {
    this.registration.username = pUsername
    this.registration.email = pEmail
    this.registration.passwordHash = pPasswordHash 

    this.registerService.register(this.registration)
  }

  ngOnInit() {}

}
*/
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
