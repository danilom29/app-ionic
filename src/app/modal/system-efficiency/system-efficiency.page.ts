import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ValidateRequired } from 'src/app/validators/required.validator';

@Component({
  selector: 'app-system-efficiency',
  templateUrl: './system-efficiency.page.html',
  styleUrls: ['./system-efficiency.page.scss'],
})
export class SystemEfficiencyPage implements OnInit {

  public eficienciaForm: FormGroup;
  public dataEficiencia = [{value:"0.9",description:"Eficiência irrigação localizada"}];//OBS.: criar tabela

  constructor(
    private modalController: ModalController
  ) {
    this.eficienciaForm = new FormGroup({
      'eficiencia': new FormControl(null, ValidateRequired)
    });
   }

  ngOnInit() {
  }

  setarEficiencia = () => {
    this.modalController.dismiss(this.eficienciaForm.get('eficiencia').value);
  }

}
