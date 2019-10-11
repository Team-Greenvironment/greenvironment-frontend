import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register/register.service';
import {Registration} from '../../models/registration';

@Component({
  selector: 'registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  registration: Registration 
 
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
    this.registration.passwordHash = pPasswordHash 

    this.registerService.register(this.registration)
    } else{console.log('password NOT same'); }
  }

  ngOnInit() {}

}

