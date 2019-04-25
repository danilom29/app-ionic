import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { OfflineManagerService } from './offline-manager.service';
import { ToastController } from '@ionic/angular';

const API_STORAGE_KEY = 'specialkey';
const API_URL = "http://localhost:7000";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  public options = {
    'headers': new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.S1Cg_Ilvjkhb5e0YIUFwWvhtIeqkdjhmDx9IBKMf5qg'
    })
  }

  constructor(
    private http: HttpClient, 
    private networkService: NetworkService, 
    private storage: Storage, 
    private toastController: ToastController,
    private offlineManager: OfflineManagerService
  ) { }
 
  getUsers(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('users'));
    } else {
      // Return real API data and store it locally
      return this.http.get(`${API_URL}/user`, this.options).pipe(
        map((res: any) => res),
        tap(res => {
          this.setLocalData('users', res);
        })
      )
    }
  }
 
  updateUser(user, data): Observable<any> {
    let url = `${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'PUT', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'PUT', data);
          throw new Error(err);
        })
      );
    }
  }

  get = (route) => new Promise((resolve, reject) => {
    
    this.http.get(`${API_URL}/${route}`, this.options).subscribe((res: any) => {

      resolve(res);
    
    }, rej => {

      this.toast( 'Erro ao realizar operação.', 'danger', 5000);

      reject(rej);
    });
  })

  post = (route, params) => new Promise((resolve, reject) => {
    
    this.http.post(`${API_URL}/${route}`, params, this.options).subscribe((res: any) => {

      resolve(res);
    
    }, rej => {

      this.toast( 'Erro ao realizar operação.', 'danger', 5000);

      reject(rej);
    });
  })

  put = (route, data) => new Promise((resolve, reject) => {
    
    this.http.patch(`${API_URL}/${route}`, data, this.options).subscribe(res => {

      resolve(res);

    }, rej => {

      this.toast( 'Erro ao realizar operação.', 'danger', 5000);

      reject(rej);
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

}
