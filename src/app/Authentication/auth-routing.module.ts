import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { ForgetPasswordComponent } from './Pages/forget-password/forget-password.component';
import { EmailVerifyingComponent } from './Pages/email-verifying/email-verifying.component';
import { CurrentPasswordComponent } from './Pages/current-password/current-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { TokenVerifyComponent } from './Pages/token-verify/token-verify.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent, pathMatch: 'full',
  },
  {
    path: 'register', component: RegistrationComponent,
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent,
  },
  {
    path: 'current-password', component: CurrentPasswordComponent
  },
  {
    path: 'verify-email', component: EmailVerifyingComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'expire-token', component: TokenVerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
