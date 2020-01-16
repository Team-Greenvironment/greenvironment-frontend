import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login/login.service';
import {Router} from '@angular/router';
import * as sha512 from 'js-sha512';
import {IErrorResponse} from '../../models/interfaces/IErrorResponse';

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

  private getErrorMessage() {
    return this.errorMessage;
  }

  private loginError(errorResponse: IErrorResponse) {
    const error = errorResponse.error;
    this.errorOccurred = true;
    this.errorMessage = error.errors[0].message;
  }

  /**
   * Fired when the submit button is pressed.
   * A login request is performed and the user is redirected to the home page on success.
   * @param pEmail
   * @param pPasswordHash
   */
  onClickSubmit(pEmail: string, pPasswordHash: string) {
    this.errorOccurred = false;
    this.errorMessage = ' ';
    this.login.email = pEmail.trim().toLowerCase();
    this.login.passwordHash = sha512.sha512(pPasswordHash);
    this.loginService.login(this.login).subscribe( () => {
      this.router.navigateByUrl('').catch((error) => {
        this.errorMessage = error.message;
        this.errorOccurred = true;
      });
    }, (error: IErrorResponse) => {
      if (error.error) {
        this.loginError(error);
      }
    });
  }

  ngOnInit() {}
}

