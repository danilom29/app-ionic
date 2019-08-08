import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public loading: LoadingService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [ValidateRequired, Validators.email]],
      password: ['', [ValidateRequired, Validators.minLength(6), Validators.maxLength(191)]]
    });
  }
 
  ngOnInit() {
  }
 
  login() {
    this.loading.present();
    this.authService.login(this.loginForm.value).then((res: any) => { 
      this.loading.dismiss();
    }).catch((err: any) => { 
      this.loading.dismiss();
      this.authService.presentAlert( err.message, 'Erro!');
    });
  }

}
