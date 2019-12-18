import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login/login.service';
import {Router} from '@angular/router';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  login: Login
  hide = true;
  errorOccurred: boolean = false;
  errorMessage: string;

  constructor(private loginService: LoginService,private router: Router) {
    this.login = {passwordHash: null, email: null};
  }

  public getErrorMessage(){
    return this.errorMessage;
  }

  public loginError(error : any){
    console.log(error.errors[0].message);
    this.errorOccurred = true;
    this.errorMessage = error.errors[0].message;
  }

  onClickSubmit(pEmail: string, pPasswordHash: string) {
    console.log('try to login with mail adress:' + pEmail); 
    this.errorOccurred = false;
    this.errorMessage = " ";
    this.login.email = pEmail.trim()
    this.login.passwordHash = sha512.sha512(pPasswordHash);
    console.log(this.login.passwordHash);

    console.log(this.login.passwordHash)

    this.loginService.login(this.login, error => this.loginError(error.json()));
  }
  email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit() {}
}

