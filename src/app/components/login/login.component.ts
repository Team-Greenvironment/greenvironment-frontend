import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  login: Login 
  user: User

  constructor(private loginService: LoginService) {
    this.login = {passwordHash: null, email: null};
  }

  onClickSubmit(pEmail: string, pPasswordHash: string) {
    console.log('email: ' + pEmail); 
    this.login.email = pEmail
    this.login.passwordHash = pPasswordHash 

    this.loginService.login(this.login)
  }

  ngOnInit() {}
}

