import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { OfflineManagerService } from './offline-manager.service';
import { ToastController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

const API_STORAGE_KEY = 'specialkey';
const API_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient, 
    private networkService: NetworkService, 
    private storage: Storage, 
    private toastController: ToastController,
    private offlineManager: OfflineManagerService,
    public alertController: AlertController
  ) { }

  get = (route) => new Promise((resolve, reject) => {    
    this.storage.get('auth-token').then(res => {     
      let headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': res
      });
      
      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
  
        from(this.getLocalData(route)).subscribe(res =>{
          resolve(res);
        });
  
      } else {
        
        this.http.get(`${API_URL}/${route}`, {headers: headers}).subscribe((res: any) => {
          
          this.setLocalData(route, res);
          resolve(res);
        
        }, rej => {
    
          this.toast( 'Erro ao realizar operação.', 'Erro!', 3000);
    
          reject(rej);
        });
      }

    });
  })

  post = (route, params) => new Promise((resolve, reject) => {
    this.storage.get('auth-token').then(res => {     
      let headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': res
      });

      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        
        from(this.offlineManager.storeRequest(`${API_URL}/${route}`, 'POST', params)).subscribe(res => {
          
          resolve(res);
  
        });
  
      }else{
  
        this.http.post(`${API_URL}/${route}`, params, {headers: headers}).subscribe((res: any) => {
    
          resolve(res);
        
        }, rej => {
    
          this.presentAlert( 'Erro ao realizar operação.', 'Erro!');
    
          reject(rej);
        });
  
      }
    });
  })

  put = (route, data) => new Promise((resolve, reject) => {
    this.storage.get('auth-token').then(res => {     
      let headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': res
      });

      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
  
        from(this.offlineManager.storeRequest(`${API_URL}/${route}`, 'PATCH', data));
        reject();
  
      } else {
  
        this.http.patch(`${API_URL}/${route}`, data, {headers: headers}).subscribe(res => {
    
          resolve(res);
    
        }, rej => {
    
          this.presentAlert( 'Erro ao realizar operação.', 'Erro!');
    
          reject(rej);
        });
      
      }
    });
  })

  report = (route, params) => new Promise((resolve, reject) => {
    this.storage.get('auth-token').then(res => {     
      let headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': res
      });

      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        
        from(this.offlineManager.storeRequest(`${API_URL}/${route}?Authorization=JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.S1Cg_Ilvjkhb5e0YIUFwWvhtIeqkdjhmDx9IBKMf5qg`, 'POST', params)).subscribe(res => {
          
          resolve({
            ret: false,
            message: "Erro ao tentar se conectar com a internet."
          });
  
        });
  
      }else{
  
        this.http.post(`${API_URL}/${route}`, params, {headers: headers}).subscribe((res: any) => {
    
          resolve({
            ...res,
            message: 'Erro ao realizar operação.'
          });
        
        }, rej => {
    
          this.presentAlert( 'Erro ao realizar operação.', 'Erro!');
    
          reject(rej);
        });
  
      }
    });
  })
 
  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }
 
  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  toast(msg, color, duration){
    let toast = this.toastController.create({
      message: msg,
      duration: duration,
      position: 'bottom',
      color: color
    });
    toast.then(toast => toast.present());
  }

  async presentAlert(msg, header){

    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
