import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-calc-result',
  templateUrl: './calc-result.page.html',
  styleUrls: ['./calc-result.page.scss'],
})
export class CalcResultPage implements OnInit {
  
  @Input("et0") et0;
  @Input("etc") etc;
  @Input("litro_vaso") litro_vaso;
  @Input("dividendo") dividendo;
  @Input("aplicacao") aplicacao;
  @Input("ra") ra;
  @Input("culture_id") culture_id;
  @Input("form") form;

  constructor(
    private modalController: ModalController,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  onCalcSave = () => {
    
    let params = {
      radiacao: this.ra,
      tmax: this.form.tmax,
      tmed: this.form.tmed,
      tmin: this.form.tmin,
      kc: this.form.kc,
      area: this.form.area,
      eficiencia: this.form.eficiencia,
      etc: this.etc,
      eto: this.et0,
      litro_vaso: this.litro_vaso,
      culture_id: this.culture_id,
      data_inclusao: this.dataAtualFormatada()
    }
    
    this.api.post('result', params) .then(res => { this.modalController.dismiss(true); }, rej => { });    
  }

  dataAtualFormatada(){
    let day;
    let month;
		let data = new Date();
		let dia = data.getDate();
		if (dia.toString().length == 1){
      day = "0"+dia;
    }else{
      day = data.getDate();
    }
		  
		var mes = data.getMonth()+1;
		if (mes.toString().length == 1){
      month = "0"+mes;
    }else{
      month = data.getMonth()+1;
    }
      
		var ano = data.getFullYear();  
		return ano+"-"+month+"-"+day;
	}

}
