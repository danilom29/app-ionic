import { Platform, ToastController, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { NetworkService, ConnectionStatus } from './network.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'auth-token'; 
const API_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public authenticationState = new BehaviorSubject(false);
  public options = {
    'headers': new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
 
  constructor(
    private storage: Storage,
    private http: HttpClient,  
    public alertController: AlertController,
    private networkService: NetworkService, 
    private plt: Platform
  ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }
 
  login = (params) => new Promise((resolve, reject) => {
    
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      
      this.presentAlert( 'Erro ao tentar se conectar com a internet.', 'Atenção!');
      reject();
      
    } else {

      this.http.post(`${API_URL}/token`, params).subscribe((res: any) => {
        
        this.storage.set('email', params.email);
    
        this.storage.set(TOKEN_KEY, 'JWT ' + res.token).then(() => {
          this.authenticationState.next(true);
        });
    
        resolve({
          ...res,
          message: 'Login realizado com sucesso.'
        });
      
      }, rej => {
        reject(rej);
      });

    }
  })

  post = (route, params) => new Promise((resolve, reject) => {
    
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      
      reject({
        message: 'Erro ao tentar se conectar com a internet.'
      });

    } else {

      this.http.post(`${API_URL}/${route}`, params, this.options).subscribe((res: any) => {
    
        if (route != 'users/email') this.presentAlert( 'Operação realizada com sucesso.', 'Sucesso!');
  
        resolve({
          ...res,
          message: 'Operação realizada com sucesso.'
        });
      
      }, rej => {
  
        reject({
          ...rej,
          message: 'Erro ao realizar operação.'
        });

      });
    
    }
  })
 
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
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
