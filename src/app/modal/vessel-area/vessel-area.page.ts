import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidateRequired } from 'src/app/validators/required.validator';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vessel-area',
  templateUrl: './vessel-area.page.html',
  styleUrls: ['./vessel-area.page.scss'],
})
export class VesselAreaPage implements OnInit {

  public areaForm: FormGroup;
  public area: any;
  public pi = 3.141592;
  
  constructor(
    private modalController: ModalController
  ) {
    this.areaForm = new FormGroup({
      'raio': new FormControl(null, ValidateRequired)
    });
  }

  ngOnInit() {
  }

  dimissModal(){
    this.modalController.dismiss();
  }

  calcularArea = () => {
    let raio = this.areaForm.get('raio').value / 2
    this.area = (this.pi * Math.pow(raio, 2))/10000;
    this.modalController.dismiss(this.area.toFixed(4));
  }

}
