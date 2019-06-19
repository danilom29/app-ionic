import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(191)])
    })
  }

  enviar = () => {
    this.authService.post('users/email', this.forgotPasswordForm.value).then(res => {
      let retorno:any = res;
      
      if(retorno.ret){
        this.authService.toast('Senha enviada ao e-mail cadastrado.', 'success', 3000);  
      }else{
        this.authService.toast('Erro ao enviar e-mail.', 'warning', 3000);
      }
    },rej =>{
      this.authService.toast('Erro ao recuperar senha.', 'danger', 3000);
    })
  }

}
