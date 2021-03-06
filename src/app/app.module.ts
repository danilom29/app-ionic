import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { TabsPageModule } from './tabs/tabs.module';

import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { KcPage } from './modal/kc/kc.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, KcPage],
  entryComponents: [KcPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule, 
    ReactiveFormsModule,
    TabsPageModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network
  ],
  exports: [KcPage],
  bootstrap: [AppComponent]
})
export class AppModule {}
