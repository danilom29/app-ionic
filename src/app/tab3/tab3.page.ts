import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateRequired } from '../validators/required.validator';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { ValidateValueComparison } from '../validators/value-comparison.validator';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public userRegisterForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    public loading: LoadingService
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

      this.userRegisterForm.patchValue(res);

    }).catch(err => {

    });
  }

  ngOnInit() {
    this.userRegisterForm.controls.password.setValidators([ValidateValueComparison(this.userRegisterForm.get('repeatpassword'),
    'Campos Senha e Confirmar Senha precisam ter o mesmo valor')]);
  } 

  register(){
    delete this.userRegisterForm.value.repeatpassword;
    this.loading.present();
    this.api.put('user', this.userRegisterForm.value)
    .then(res => { 
      this.loading.dismiss();
      this.api.presentAlert('Dados atualizados.', 'Sucesso!');
    }).catch(err => {
      this.loading.dismiss();
    });
  }

  logout() {
    this.authService.logout();
  }

}
