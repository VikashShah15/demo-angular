import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authApi } from '../Constant/profileApi.constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { BaseService } from 'src/app/shared/services/base.service';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private api: BaseService) {

  }
  registration(model: any, code: any): Observable<any> {

    return this.api.post(`${authApi.auth.registration}`.replace('{verificationCode}', code), model);
  }
  profileUpdate(model, userId): Observable<any> {
    return this.api.put(`${authApi.auth.profileUpdate}`.replace('{userId}', userId), model);
  }
  requestEmailVerification(email): Observable<any> {
    return this.api.get(`${authApi.auth.requestEmailVerification}`.replace('{email}', email));
  }
  login(model): Observable<any> {
    return this.api.post(`${authApi.auth.login}`, model);
  }
  verifyEmail(token): Observable<any> {
    return this.api.get(`${authApi.auth.verifyEmail}`.replace('{token}', token));
  }
  currentpassword(model: any): Observable<any> {
    return this.api.post(`${authApi.auth.currentPassword}`, model);
  }
  changePassword(model: any): Observable<any> {
    return this.api.postWithHeader(`${authApi.auth.changePassword}`, model);
  }
  resetPassword(token, model): Observable<any> {
    const m = { newPassword: model.newPassword };
    return this.api.post(`${authApi.auth.resetPassword}`.replace('{token}', token), m);
  }
  verifyResetPasswordToken(token): Observable<any> {
    return this.api.post(`${authApi.auth.verifyResetPasswordToken}`.replace('{token}', token));
  }
  forgetPassword(email): Observable<any> {
    return this.api.get(`${authApi.auth.forgetPassword}`.replace('{email}', email));
  }
  getUserPlan(): Observable<any> {
    return this.api.get(`${authApi.auth.getUserPlan}`);
  }
}
