import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public arr = [];
  public jsonData = [];
  public arrCulture = [];
  public url: any = environment;
  public searchCulture : any = "";
  @ViewChild('select') select;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private storage: Storage,
    private modalController: ModalController,
    public loading: LoadingService
  ){}

  ngOnInit(): void {
    this.loading.present();
  }
  
  ionViewWillEnter() {
    this.readDataCulture().then((res: any) => {
      this.arrCulture = res; 
      this.readData();
    });
  }

  clear(){
    this.select.value = null;
    this.readData();
  }

  logout() {
    this.authService.logout();
  }

  readData(param = null){
    let id = param ? param.value.id : 0;
    this.api.get('resultados/' + id).then((res: any) => {
      this.arr = res; this.jsonData = res;
      this.loading.dismiss();
    }).catch((err: any) => {
      this.loading.dismiss();
    })
  }

  readDataCulture = () => {
    return this.api.get('result/culturas');
  }

  filterItems(event){
    
    this.jsonData = this.arr.filter((item) => {
      return item.cultura.toLowerCase().includes(event.target.value);
    });

  }  

  print(type){
    this.loading.present();
    this.storage.get('email').then(email => {
      let rotaInterna = this.url.rotaInterna;
      let phantom = {
        rotaInterna: rotaInterna,
        name:"relatorio-resultados_" + email,
        tipoPDF: "report"
      }
      let param = {
        data: this.jsonData,
        email: email,
        type: type,
        phantom: phantom
      }
      
      this.api.report('result/report', param).then((res: any) => {
        this.loading.dismiss();
        if(res.ret) return this.api.presentAlert("Relatório enviado ao e-mail cadastrado.", 'Sucesso!');
        
        this.api.presentAlert(res.message, 'Atenção!');   
        
      }).catch(err => {
        this.loading.dismiss();
      });
    })
  }


}
