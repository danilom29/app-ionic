import { Platform, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const TOKEN_KEY = 'auth-token';
const API_STORAGE_KEY = 'specialkey';
const API_URL = "http://localhost:7000";

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
    private toastController: ToastController,
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
    
    this.http.post(`${API_URL}/token`, params).subscribe((res: any) => {
      
      this.storage.set('email', params.email);
  
      this.storage.set(TOKEN_KEY, 'JWT ' + res.token).then(() => {
        this.authenticationState.next(true);
      });
  
      resolve(res);
    
    }, rej => {
      reject(rej);
    });
  })

  post = (route, params) => new Promise((resolve, reject) => {
    
    this.http.post(`${API_URL}/${route}`, params, this.options).subscribe((res: any) => {
  
      this.toast( 'Operação realizada com sucesso.', 'success', 5000);

      resolve(res);
    
    }, rej => {

      this.toast( 'Erro ao realizar operação.', 'danger', 5000);

      reject(rej);
    });
  })
 
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
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

}
