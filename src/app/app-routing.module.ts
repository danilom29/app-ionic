import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  // { path: 'dashboard', canActivate: [AuthGuard], loadChildren: './tabs/tabs.module#TabsPageModule' }
  { path: 'tabs', canActivate: [AuthGuard], loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'register', loadChildren: './public/register/register.module#RegisterPageModule' },
  { path: 'kc', loadChildren: './modal/kc/kc.module#KcPageModule' },  { path: 'vessel-area', loadChildren: './modal/vessel-area/vessel-area.module#VesselAreaPageModule' },
  { path: 'system-efficiency', loadChildren: './modal/system-efficiency/system-efficiency.module#SystemEfficiencyPageModule' },
  { path: 'calc-result', loadChildren: './modal/calc-result/calc-result.module#CalcResultPageModule' },
  { path: 'forgot-password', loadChildren: './public/forgot-password/forgot-password.module#ForgotPasswordPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
