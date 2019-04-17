import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [ValidateRequired, Validators.email]],
      password: ['', [ValidateRequired, Validators.minLength(6), Validators.maxLength(191)]]
    });
  }
 
  ngOnInit() {
  }
 
  login() {
    this.authService.login(this.loginForm.value).then((res: any) => { }).catch((err: any) => { });
  }

}
