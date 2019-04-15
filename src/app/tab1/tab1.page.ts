import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidateRequired } from '../validators/required.validator';
import { ModalController } from '@ionic/angular';
import { KcPage } from '../modal/kc/kc.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('slides') slides;
  
  public calcForm: FormGroup;
  public showKc: boolean = false;
  public pi = 3.14159265358979;
  public dados = [];
  public diaria = 0;
  public ra = 0;
  public et0 = 0;
  public etc = 0;
  public litro_vaso = 0;
  private latitude: number;
  public dividendo = 0;
  public aplicacao = 0;
  private kc;
  
  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private modalController: ModalController
  ) { }

  // ngOnInit() {
  // }

  slideOpts = {
    effect: 'coverflow'
  };

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  ngOnInit() {

    navigator.geolocation.getCurrentPosition(res => { console.log(res)
      alert("Latitude: "+res.coords.latitude);
      this.calcForm.get('latitude').setValue(res.coords.latitude);
      this.radiacaoPorDia();
    });

    this.calcForm = new FormGroup({
      'tmax': new FormControl(null, ValidateRequired),
      'tmin': new FormControl(null, ValidateRequired),
      'tmed': new FormControl(null, ValidateRequired),
      'latitude': new FormControl(null, ValidateRequired),
      'ra': new FormControl(null, null),
      'culture_id': new FormControl(null, ValidateRequired),
      'kc': new FormControl(null, ValidateRequired),
      'area': new FormControl(null, ValidateRequired),
      'eficiencia': new FormControl(null, ValidateRequired)
    });

    this.readDataCultura();
    this.readDataEstagio();
    
  }

  public culturas: any;
  public estagios: any;
  
  async openDialogKc(){
    const modal = await this.modalController.create({
      component: KcPage,
      componentProps: {
        culturas: this.culturas,
        estagios: this.estagios 
      }
    });

    return await modal.present();
    // let dialogRef;
    // dialogRef = this.dialog.open(DialogOverviewComponent, {
    //   width: '290px',
    //   height: '405px',
    //   data: {
    //     culturas: this.culturas,
    //     estagios: this.estagios 
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => { 
    //   if(typeof result != "undefined"){
    //     this.calcForm.get('kc').setValue(result.data);
    //     this.calcForm.get('culture_id').setValue(result.cultura);
    //     this.showKc = true;
    //     this.kc = result.data;
    //   }
    // });

  }

  openDialogArea = () => { 
    // let dialogRef;
    // dialogRef = this.dialog.open(DialogAreaComponent, {
    //   width: '290px',
    //   height: '250px'
    // });

    // dialogRef.afterClosed().subscribe(result => { 
    //   if(typeof result != "undefined"){
    //     this.calcForm.get('area').setValue(result.data);
    //   }
    // });

  }

  openDialogEficiencia = () => { 
    // let dialogRef;
    // dialogRef = this.dialog.open(DialogAreaComponent, {
    //   width: '290px',
    //   height: '175px',
    //   data: {flag: 1}
    // });

    // dialogRef.afterClosed().subscribe(result => { 
    //   if(typeof result != "undefined"){
    //     this.calcForm.get('eficiencia').setValue(result.data);
    //   }
    // });

  }

  readDataCultura = () => {
    this.api.get('culture').then(res => {     
      this.culturas = res;
    })
  }

  readDataEstagio = () => {
    this.api.get('stages').then(res => {   
      this.estagios = res;
    })
  }

  onCalcSave = () => {
    
    let params = {
      radiacao: this.ra,
      tmax: this.calcForm.controls.tmax.value,
      tmed: this.calcForm.controls.tmed.value,
      tmin: this.calcForm.controls.tmin.value,
      kc: this.calcForm.controls.kc.value,
      area: this.calcForm.controls.area.value,
      eficiencia: this.calcForm.controls.eficiencia.value,
      etc: this.etc,
      eto: this.et0,
      litro_vaso: this.litro_vaso,
      culture_id: this.calcForm.get('culture_id').value,
      data_inclusao: this.dataAtualFormatada()
    }

    this.api.post('result', params)
    .then(res => { }, rej => { });    
  }

  closeResult = () => {
    
  }
  
  onCalcFormSubmit = () => {
    
    this.ra = this.calcForm.controls['ra'].value;
    let tmedia = this.calcForm.controls['tmed'].value;
    let tmaxima = this.calcForm.controls['tmax'].value;
    let tminima = this.calcForm.controls['tmin'].value;
    let base = Math.round(tmaxima-tminima); 
    this.et0 = (0.0023*this.ra)*(Math.pow(base, 0.5))*(tmedia+17.8);
    this.et0 = parseFloat(this.et0.toFixed(2));
    this.etc = this.calcForm.controls['kc'].value*this.et0;
    this.etc = parseFloat(this.etc.toFixed(2));
    this.litro_vaso = this.etc*(this.calcForm.controls['area'].value/this.calcForm.controls['eficiencia'].value);
    this.litro_vaso = parseFloat(this.litro_vaso.toFixed(2));
    this.dividendo = this.litro_vaso * 1000 >= 1000 ? 3 : 2;
    this.aplicacao = (this.litro_vaso * 1000) / this.dividendo;
    this.aplicacao = parseFloat(this.aplicacao.toFixed(2));
  }

  anguloHorario() { 
    let lat = this.calcForm.controls['latitude'].value;
    let tan = (Math.acos(((((-Math.tan((lat)*this.pi/180))*(Math.tan((-23.01163673)*this.pi/180))))+(-0.015707317/((0.985800348)*(Math.cos((-23.01163673)*this.pi/180))))))*180/this.pi);
    return tan;
  };
  
  meioDiaSolar(argument){ 
    let sol = (12+(0.12357*(Math.sin(argument))-(0.004289*(Math.cos(argument)))+(0.153809*(Math.sin(2*argument)))+(0.060783*(Math.cos(argument)))));
    return sol;
  }
  
  nascerSol() {
    let dia = this.dateDiferencaEmDias();
    let param = dia;
    if(dia == 1){
      param = this.d();
    }
    let I3 = this.anguloHorario(), I2 = this.meioDiaSolar(param);
    let nascer = (I2-(I3/15));
  }
  
  porSol() {
    let dia = this.dateDiferencaEmDias();
    let param = dia;
    if(dia == 1){
      param = this.d();
    }
    let I3 = this.anguloHorario(), I2 = this.meioDiaSolar(param);
    let por = (I2+(I3/15));
  }
  
  declinacaoSolar(){    
    let dia = this.dateDiferencaEmDias();
    let declinacao = (23.45*(Math.sin(((360*(dia+284))/365)*this.pi/180)));
    return declinacao;
  }
  
  d(){
    let dia = this.dateDiferencaEmDias();    
    let indefinido = (dia-1)*(360/365.242);
    return indefinido;
  }
  
  distanciaTerraSol(){
    
    let dia = this.dateDiferencaEmDias(); 
    let distancia = 1+0.033*Math.cos(2*this.pi/365*dia);
    return distancia;
  }
  
  hora_cv(argument) {
    let hora = ((argument-this.direita(argument))/100)+this.direita(argument)/60;
    return hora;
  }
  
  direita(argument) {
    argument = argument.toString();
    let res = argument.substring(argument.length - 2, argument.length);
    return res;
  }
  
  h(argument) { 
    let dia = this.dateDiferencaEmDias();
    let param = dia;
    if(dia == 1){
      param = this.d();
    }
    let angulo = 15*(argument-this.meioDiaSolar(param));
    return angulo;
  }
  
  cos(argument){ 
    let lat = this.calcForm.controls['latitude'].value;
    
    let cosseno = Math.sin(lat*this.pi/180)*Math.sin(this.declinacaoSolar()*this.pi/180)+Math.cos(lat*this.pi/180)*Math.cos(this.declinacaoSolar()*this.pi/180)*Math.cos(argument*this.pi/180);
    return cosseno;
  }
  
  ro(argument){ 
    let r = 1367*argument*this.distanciaTerraSol(); 
    return r;
  }  

  dateDiferencaEmDias() {
    let first_day = new Date("01/01/2018");
    let now = new Date();
    // Descartando timezone e horário de verão
    var utc1 = Date.UTC(now.getFullYear(), first_day.getMonth(), first_day.getDate());
    var utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1);
 
    return Math.floor((utc2 - utc1) / ( 1000 * 60 * 60 * 24) );
  }

  radiacaoPorDia(){
    if(this.calcForm.controls['latitude'].value){
      this.dados =[];
      this.diaria = 0;
      let final = 1900, inicial = 500;
      let anterior = inicial; 
      while(anterior<=final){
        let hora = this.hora_cv(anterior);
        let angulo = this.h(hora);
        let cosseno = this.cos(angulo);
        let r = this.ro(cosseno);
        let integral;
        if(r<0){
          integral = 0
        }else{
          integral = r;
        }
        this.dados.push({"integral":integral,"hora":anterior});
        anterior = anterior+5; 
      }
      let soma = 0;
      let soma1 = 0; 
      
      for(let i = 0; i < this.dados.length; i++) {
        let element = this.dados[i];
        if(element.hora == inicial || element.hora == inicial + 100){
          soma+=element.integral;
          if(element.hora == inicial + 100)i--;        
        }
        if(element.hora == inicial + 100){
          inicial += 100;
          let horaria = (5/60)*((soma/2)+soma1);
          soma = 0;
          soma1 = 0; 
          this.diaria+=horaria;
        }
        if(element.hora >= inicial + 5 && element.hora <= inicial + 55){ 
          soma1+=element.integral;
        }
      }; 
      let valorFinal = (this.diaria*0.0036)/2.45;      
      this.calcForm.controls['ra'].setValue(parseFloat(valorFinal.toFixed(2)));

    }else{
      this.openDialog();
    }
  }

  openDialog(): void {
    // let dialogRef = this.dialog.open(DialogMessageComponent, {
    //   width: '250px',
    //   data: {msg: "Informe a LATITUDE, para continuar operação."}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
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

  logout() {
    this.authService.logout();
  }

  get() {
    this.api.getUsers(true).subscribe(r => {
      console.log(r)
    });
  }

}
