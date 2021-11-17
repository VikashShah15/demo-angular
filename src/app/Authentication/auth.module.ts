import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Pages/login/login.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { ForgetPasswordComponent } from './Pages/forget-password/forget-password.component';
import { EmailVerifyingComponent } from './Pages/email-verifying/email-verifying.component';
import { CurrentPasswordComponent } from './Pages/current-password/current-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { TokenVerifyComponent } from './Pages/token-verify/token-verify.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgetPasswordComponent,
    EmailVerifyingComponent,
    CurrentPasswordComponent,
    ResetPasswordComponent,
    TokenVerifyComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
