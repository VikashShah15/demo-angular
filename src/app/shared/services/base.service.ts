import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(
        private http: HttpClient
    ) { }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.BASE_URL_AUTHENTICATION}${path}`, { params })
            .pipe(catchError(this.formatErrors));
    }

    getWithJWT(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return this.http.get(`${environment.BASE_URL_AUTHENTICATION}${path}`, { params })
            .pipe(catchError(this.formatErrors));
    }
    put(path: string, body: object = {}): Observable<any> {
        return this.http.put(
            `${environment.BASE_URL_AUTHENTICATION}${path}`,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }

    post(path: string, body: object = {}): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        return this.http.post(
            `${environment.BASE_URL_AUTHENTICATION}${path}`,
            body,
        ).pipe(catchError(this.formatErrors));
    }

    postWithHeader(path: string, body: object = {}): Observable<any> {
        return this.http.post(
            `${environment.BASE_URL_AUTHENTICATION}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    delete(path): Observable<any> {
        return this.http.delete(
            `${environment.BASE_URL_AUTHENTICATION}${path}`
        ).pipe(catchError(this.formatErrors));
    }

}
