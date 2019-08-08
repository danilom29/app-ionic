import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    public loading: LoadingService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(191)])
    })
  }

  enviar = () => {
    this.loading.present();
    this.authService.post('users/email', this.forgotPasswordForm.value).then(res => {
      let retorno:any = res;
      this.loading.dismiss();
      
      if(retorno.ret){
        this.authService.presentAlert('Senha enviada ao e-mail cadastrado.', 'Sucesso!');  
      }else{
        this.authService.presentAlert('Erro ao enviar e-mail.', 'Atenção!');
      }
      
    }).catch(err => {

      this.loading.dismiss();
      this.authService.presentAlert('Erro ao recuperar senha.', 'Erro!');
  
    });
  }

}
