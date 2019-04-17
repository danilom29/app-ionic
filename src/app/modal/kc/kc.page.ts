import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';
import { ApiService } from 'src/app/services/api.service';

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
    private api: ApiService
  ) { 
    this.kcForm = new FormGroup({
      'culture_id': new FormControl(null, ValidateRequired),
      'stage_id': new FormControl(null, ValidateRequired),
      'hideKc': new FormControl(),
      'umidade_maior_setenta': new FormControl(null, ValidateRequired),
      'kc': new FormControl(null, null),
      'kc_value': new FormControl(null, null)
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

    this.api.post('kc/value', this.kcForm.value).then((res: any) => {
      this.dataKc = res;

      if(this.dataKc.length > 0) return this.api.toast(res.message, 'success', 5000);
      
      return this.api.toast('Nenhum resultado encontrado', 'warning', 5000);
    });
  }

  createKc(){
    this.api.post('kc', this.kcForm.value).then((res: any) => {

      this.api.toast(res.message, 'success', 5000);
      let data =  {
        kc: res.kc,
        cultura: res.id
      }
      
      this.modalController.dismiss(data);
      
    }); 
  }

  selecionaKc(){
    let data =  { kc: this.kcForm.value.kc_value, cultura: this.kcForm.value.culture_id };

    this.modalController.dismiss(data);
  }

}
