import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateRequired } from '../validators/required.validator';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ValidateValueComparison } from '../validators/value-comparison.validator';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public userRegisterForm: FormGroup;

  constructor(
    private api: ApiService
  )
  {
    this.userRegisterForm = new FormGroup({
      'name': new FormControl(null, [ValidateRequired]),
      'email': new FormControl(null, [ValidateRequired, Validators.email]),
      'password': new FormControl(null),
      'repeatpassword': new FormControl(null) 
    });

    this.api.get('user')
    .then((res: any) => {
      console.log(res); 
      this.userRegisterForm.patchValue(res);
    }, rej => { });
  }

  ngOnInit() {
    this.userRegisterForm.controls.password.setValidators([ValidateValueComparison(this.userRegisterForm.get('repeatpassword'),
    'Campos Senha e Confirmar Senha precisam ter o mesmo valor')]);
  } 

  register(){
    delete this.userRegisterForm.value.repeatpassword;

    this.api.put('user', this.userRegisterForm.value)
    .then(res => { 
      this.api.toast("Dados atualizados.", "success", 2000);
    }, rej => { });
  }

}
