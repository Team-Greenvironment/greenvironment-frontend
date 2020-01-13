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

  constructor(private loginService: LoginService, private router: Router) {
    this.login = {passwordHash: null, email: null};
  }
  login: Login;
  hide = true;
  errorOccurred = false;
  errorMessage: string;
  email = new FormControl('', [Validators.required, Validators.email]);

  public getErrorMessage() {
    return this.errorMessage;
  }

  public loginError(error: any) {
    this.errorOccurred = true;
    this.errorMessage = error.errors[0].message;
  }

  onClickSubmit(pEmail: string, pPasswordHash: string) {
    this.errorOccurred = false;
    this.errorMessage = ' ';
    this.login.email = pEmail.trim().toLowerCase();
    this.login.passwordHash = sha512.sha512(pPasswordHash);

    this.loginService.login(this.login, error => this.loginError(error.json()));
  }

  ngOnInit() {}
}

