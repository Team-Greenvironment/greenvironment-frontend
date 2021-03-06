import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register/register.service';
import { Registration } from '../../models/registration';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  registration: Registration;
  errorOccurred = false;
  errorMessage: string;
  hide1 = true;
  hide2 = true;
  ageCheck = false;
  imprintCheck = false;

  constructor(private registerService: RegisterService) {
    this.registration = { username: null, passwordHash: null, email: null };
  }

  public registerError(error: any) {
    console.log(error.errors[0].message);
    this.errorOccurred = true;
    this.errorMessage = error.errors[0].message;
  }

  onClickSubmit(pUsername: string, pEmail: string, pPasswordHash: string, pPasswordHashRepeat: string) {
    this.errorOccurred = false;
    this.errorMessage = ' ';
    if (this.passwordSame(pPasswordHash, pPasswordHashRepeat) && this.boxesChecked()) {
      this.registration.username = pUsername.trim();
      this.registration.email = pEmail.trim().toLowerCase();
      this.registration.passwordHash = sha512.sha512(pPasswordHash);
      this.registerService.register(this.registration, error => this.registerError(error.json()));
    }
  }

  passwordSame(pwd: string, pwd2: string) {
    if (!pwd) {
      this.errorOccurred = true;
      this.errorMessage = 'please enter a password';
      return false;
    }
    if (pwd === pwd2) {
      return true;
    } else {
      this.errorOccurred = true;
      this.errorMessage = 'not the same password';
      return false;
    }
  }

  boxesChecked(): boolean {
    if (this.imprintCheck && this.ageCheck) {
      console.log('all boxes checked');
      return true;
    } else {
      this.errorOccurred = true;
      if (!this.ageCheck) {
        this.errorMessage = 'You have to confirm your age.';
      } else if (!this.imprintCheck) {
        this.errorMessage = 'You have to confirm that you read the privacy policy.';
      }
      return false;
    }
  }

  ngOnInit() {
  }

}

