import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/Authentication/Service/auth.service';
import { fireStoreCollectionName } from '../Constant/firestore-collection.constant';
import { FirestoreDataService } from '../services/firestore-data.service';
import { of } from 'rxjs';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private fds: FirestoreDataService,
        private as: AuthService
    ) { }
    private fscn = fireStoreCollectionName;
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // show loading spinner
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error instanceof HttpErrorResponse) {
                    // Server Side Error.
                    if (error.status !== 401) {
                        this.fds.createData({
                            ErrorDescription: JSON.stringify(error),
                            ErrorTime: Date(),
                            ClientData: JSON.parse(localStorage.getItem('cared-auth')) ?
                                JSON.parse(localStorage.getItem('cared-auth')).email : request.body.email ?
                                    request.body.email : ''
                        }, this.fscn.apiErrors)
                            .then(res => {
                                /*do something here....
                                maybe clear the form or give a success message*/
                            });
                    }
                    return throwError(error);
                }
                // } else {
                //     return of(null);
                // }
            }),
        ) as Observable<HttpEvent<any>>;
    }
}
