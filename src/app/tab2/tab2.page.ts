import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public arr = [];
  public arrCulture = [];
  public url: any = environment;
  @ViewChild('select') select;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private storage: Storage,
    private modalController: ModalController
  ){}

  ngOnInit(): void {
    console.log('tab2')
    this.readData();
    this.readDataCulture();
  }

  clear(){
    this.select.value = null;
    this.readData();
  }

  readData(param = null){
    let id = param ? param.value.id : 0;
    this.api.get('resultados/' + id).then((res: any) => { this.arr = res; },rej =>{ })
  }

  readDataCulture = () => {
    this.api.get('result/culturas').then((res: any) => { 
      // let selector = {'id': 0, 'descricao': 'Selecione'}
      this.arrCulture = res; 
    })
  }

  print(type){
    // this.progress = true;
    this.storage.get('email').then(email => {
      let rotaInterna = this.url.rotaInterna;
      let phantom = {
        rotaInterna: rotaInterna,
        name:"relatorio-resultados_" + email,
        tipoPDF: "report"
      }
      let param = {
        data: this.arr,
        email: email,
        type: type,
        phantom: phantom
      }
      
      this.api.post('result/report', param).then((res: any) => {
        // this.progress = false;
        if(res.ret) return this.api.toast("Relatório enviado ao e-mail cadastrado.", 'success', 3000);
        
        this.api.toast("Erro ao realizar operação.", 'danger', 3000);   
        
      });
    })
  }


}
