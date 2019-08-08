import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  
  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      spinner: 'lines',
      translucent: true,
      message: 'Aguarde...',
      duration: 50000
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    this.loadingController.create().then(res => { })
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}
