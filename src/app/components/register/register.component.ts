import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register/register.service';
import {Registration} from '../../models/registration';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  registration: Registration 
  errorOccurred: boolean = false;
  errorMessage: string;
 
  constructor(private registerService: RegisterService) {
    this.registration = {username: null, passwordHash: null, email: null};
  }

  onClickSubmit(pUsername: string, pEmail: string, pPasswordHash: string,pPasswordHashRepeat: string ) {
    console.log('username: ' + pUsername);
    console.log('email: ' + pEmail);

    if(pPasswordHash == pPasswordHashRepeat){
      console.log('password same');  
    this.registration.username = pUsername
    this.registration.email = pEmail
    const md5 = new Md5();
    this.registration.passwordHash = md5.appendStr(pPasswordHash).end() as string

    this.registerService.register(this.registration)
    } else{console.log('password NOT same'); }
  }

  ngOnInit() {}

}

