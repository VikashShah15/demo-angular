import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { authApi } from '../Constant/authApi.constant';
import { Response } from 'src/app/Shared/Model/Response';
import { Login, Registration, ResetPassword } from 'src/app/Shared/Model/authentication';
import { BaseService } from 'src/app/shared/services/base.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authTokenStale = localStorage.getItem('cared-access-token');
  public authTokenNew = 'new_auth_token';
  public currentToken: string;

  constructor(private api: BaseService, private router: Router, private http: HttpClient) {
    this.currentToken = this.authTokenStale;
  }
  getAuthToken() {
    return this.currentToken;
  }
  refreshToken(): Observable<string> {
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */
    this.authTokenNew = localStorage.getItem('cared-access-token');
    this.currentToken = localStorage.getItem('cared-access-token');

    return of(this.authTokenNew).
      pipe();
  }
  refreshTokenAPIcall() {
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', localStorage.getItem('cared-refresh-token'));
    // var model = { grant_type: "refresh_token", refresh_token: localStorage.getItem("cared-refresh-token") };
    return this.http.post(`${authApi.auth.refreshToken}`, body);
  }
  registration(model: Registration, code: string): Observable<Response> {
    return this.api.post(`${authApi.auth.registration}`.replace('{verificationCode}', code), model);
  }
  requestEmailVerification(email): Observable<Response> {
    return this.api.get(`${authApi.auth.requestEmailVerification}`.replace('{email}', email));
  }
  login(model: Login): Observable<Response> {
    return this.api.post(`${authApi.auth.login}`, model);
  }
  verifyEmail(token): Observable<Response> {
    return this.api.get(`${authApi.auth.verifyEmail}`.replace('{token}', token));
  }
  currentpassword(model: any): Observable<any> {
    return this.api.post(`${authApi.auth.currentPassword}`, model);
  }
  changePassword(model: any): Observable<any> {
    return this.api.post(`${authApi.auth.changePassword}`.replace('{userId}', this.getUserID()), model);
  }
  resetPassword(token, model: ResetPassword): Observable<Response> {
    const m = { newPassword: model.newPassword };
    return this.api.post(`${authApi.auth.resetPassword}`.replace('{token}', token), m);
  }
  verifyResetPasswordToken(token): Observable<Response> {
    return this.api.post(`${authApi.auth.verifyResetPasswordToken}`.replace('{token}', token));
  }
  forgetPassword(email): Observable<Response> {
    return this.api.get(`${authApi.auth.forgetPassword}`.replace('{email}', email));
  }
  public getUserID() {
    const u = JSON.parse(localStorage.getItem('cared-auth')).userId;
    if (u !== null) {
      return u;
    }
  }
  public getToken() {
    const user = localStorage.getItem('cared-access-token');
    if (user !== null) {
      return user;
    } else {
      localStorage.removeItem('cared-access-token');
    }
  }
}
