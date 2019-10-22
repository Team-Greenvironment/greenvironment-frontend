import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../../services/register/register.service';
import {Registration} from '../../models/registration';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import { parseWebDriverCommand } from 'blocking-proxy/built/lib/webdriver_commands';

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

  public registerError(error : any){
    console.log(error.errors[0].message);
    this.errorOccurred = true;
    this.errorMessage = error.errors[0].message;
  }

  onClickSubmit(pUsername: string, pEmail: string, pPasswordHash: string,pPasswordHashRepeat: string ) {
    this.errorOccurred = false;
    this.errorMessage = " ";
    if(this.passwordSame(pPasswordHash,pPasswordHashRepeat)){
      this.registration.username = pUsername
      this.registration.email = pEmail
      const md5 = new Md5();
      this.registration.passwordHash = md5.appendStr(pPasswordHash).end() as string
      this.registerService.register(this.registration, error => this.registerError(error.json()));
    }
  }

  passwordSame(pwd: string,pwd2: string){
    if(pwd == pwd2){
      console.log('password same'); 
      return true;
    } else{
      this.errorOccurred = true;
      this.errorMessage = "not the same password";
      return false;
    }
  }

  ngOnInit() {}

}

