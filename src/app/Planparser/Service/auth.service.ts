import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../Constant/planParserApi.constant';
import { ApiService } from '../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  resetPassword(value: any): any {
    throw new Error('Method not implemented.');
  }
  public feedback = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  constructor(private http: HttpClient) { }
  sendEmail(obj): Observable<any> {
    const formData = new FormData();
    formData.append('data', obj);
    return this.http.post(`${API.profile.sendEmail}`, formData);
  }
  addRating(obj): Observable<any> {
    const formData = new FormData();
    formData.append('data', obj);
    return this.http.post(`${API.profile.addRating}`, formData);
  }
  getFeedback(): any {
    return this.feedback;
  }
}
