import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public userRegisterForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { 
    this.userRegisterForm = new FormGroup({
      'name': new FormControl(null, [ValidateRequired]),
      'email': new FormControl(null, [ValidateRequired, Validators.email]),
      'password': new FormControl(null, [ValidateRequired])      
    });
  }

  ngOnInit() {
  }

  register(){
    this.authService.post('users', this.userRegisterForm.value).then((res: any) => {
      this.router.navigate(['login']);
    }).catch((err: any) => {
      console.log(err);
    });
  }

}
