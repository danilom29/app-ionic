import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-kc',
  templateUrl: './kc.page.html',
  styleUrls: ['./kc.page.scss'],
})
export class KcPage implements OnInit {

  public kcForm: FormGroup;
  public new = false;
  public dataKc: any = [];
  @Input("culturas") culturas;
  @Input("estagios") estagios;

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    public loading: LoadingService
  ) { 
    this.kcForm = new FormGroup({
      'culture_id': new FormControl(null, ValidateRequired),
      'stage_id': new FormControl(null, ValidateRequired),
      'hideKc': new FormControl(),
      'umidade_maior_setenta': new FormControl(null, ValidateRequired),
      'kc': new FormControl(null, null),
      'kc_value': new FormControl(null)
    });
  }

  ngOnInit() {
  }

  dimissModal(){
    this.modalController.dismiss();
  }

  newCulture(event){
    this.new = event.detail.checked; 
    
    if(this.new){
      this.kcForm.controls['kc'].setValidators([ValidateRequired]);
      this.kcForm.controls['kc'].updateValueAndValidity();
    }else{ 
      this.kcForm.controls['kc'].setValidators([]);
      this.kcForm.controls['kc'].updateValueAndValidity();
    }
  }

  readDataValueKc(){
    this.loading.present();
    this.api.post('kc/value', this.kcForm.value).then((res: any) => {
      this.dataKc = res;
      this.loading.dismiss();
      if(this.dataKc.length > 0) return this.api.presentAlert(res.message, 'Sucesso!');
      
      return this.api.presentAlert('Nenhum resultado encontrado', 'Atenção!');

    }).catch(err => {
      this.loading.dismiss();
    });
  }

  createKc(){
    this.loading.present();
    this.api.post('kc', this.kcForm.value).then((res: any) => {
      this.loading.dismiss();
      this.api.presentAlert(res.message, 'Sucesso!');
      let data =  {
        kc: res.kc,
        cultura: res.id
      }
      
      this.modalController.dismiss(data);
      
    }).catch(err => {
      this.loading.dismiss();
    }); 
  }

  selecionaKc(){
    let data =  { kc: this.kcForm.value.kc_value, cultura: this.kcForm.value.culture_id };

    this.modalController.dismiss(data);
  }

}
