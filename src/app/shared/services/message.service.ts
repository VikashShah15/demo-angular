import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageServices {
  private subject = new Subject<any>();
  private errorSubject = new Subject<any>();
  private successSubject = new Subject<any>();

  constructor() { }

  sendMessage = (message: object) => {
    this.subject.next(message);
  }

  clearMessages = () => {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  sendErrorMessage = (message: string) => {
    this.errorSubject.next({ text: message });
  }

  clearErrorMessage = () => {
    this.errorSubject.next();
  }

  getErrorMessage(): Observable<any> {
    return this.errorSubject.asObservable();
  }

  sendSuccessMessage = (message: string) => {
    this.successSubject.next({ text: message });
  }

  clearSuccessMessage = () => {
    this.successSubject.next();
  }

  getSuccessMessage(): Observable<any> {
    return this.successSubject.asObservable();
  }

}
