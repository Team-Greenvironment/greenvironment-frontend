import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login/login.service';
import { RouterLink } from '@angular/router';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  login: Login
  errorOccurred: boolean = false;
  errorMessage: string;

  constructor(private loginService: LoginService,private router: Router) {
    this.login = {passwordHash: null, email: null};
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
    this.login.email = pEmail
    const md5 = new Md5();
    this.login.passwordHash = md5.appendStr(pPasswordHash).end() as string

    console.log(this.login.passwordHash)

    this.loginService.login(this.login, error => this.loginError(error.json()));
  }

  ngOnInit() {}
}

