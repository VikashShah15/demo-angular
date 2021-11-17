import { Injectable, Injector } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent,
    HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent
} from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, BehaviorSubject, of } from 'rxjs';
import { take, filter, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../Authentication/Service/auth.service';
import { message } from '../Shared/Constant/alert.message';
import { MessageServices } from '../shared/services/message.service';


@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private alertMessage = message;

    constructor(private injector: Injector, private router: Router, private msg: MessageServices,) { }

    addToken(request: HttpRequest<any>, token?: string): HttpRequest<any> {
        if (request.url.indexOf('submitPlanForAnalysis') !== -1) {
            return request.clone({
                setHeaders: {
                    'X-API-Key': 'jet5RObx3O5KKq3OrAihr265UJC9v6gp7cdPBGs3',
                    'Content-Type': 'application/json'
                }
            });
        } else if (request.url.indexOf('getPlanResponse') !== -1) {
            return request.clone();
        }
        else if (request.url.indexOf('/auth/oauth/token') !== -1) {
            return request.clone({
                setHeaders: {
                    Authorization: `Basic ${window.btoa('ClientId' + ':' + 'secret')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        else { return request.clone({ setHeaders: { Authorization: 'Bearer ' + localStorage.getItem('cared-access-token') } }); }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return next.handle(this.addToken(req)).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((error as HttpErrorResponse).status) {
                        case 400:
                            return this.handle400Error(error);
                        case 401:
                            return this.handle401Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            })
        )as Observable<HttpEvent<any>>;
    }

    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logoutUser();
        }

        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.indexOf('/auth/oauth/token') !== -1) {
            this.msg.sendMessage({ command: this.alertMessage.Error });
            this.logoutUser();
        }
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
            const authService = this.injector.get(AuthService);
            return authService.refreshTokenAPIcall().pipe(
                switchMap((newToken: string) => {
                    if (newToken) {
                        this.tokenSubject.next(newToken['access_token']);
                        localStorage.setItem('cared-access-token', newToken['access_token']);
                        localStorage.setItem('cared-refresh-token', newToken['refresh_token']);
                        this.msg.sendMessage({ command: this.alertMessage.Error });
                        return next.handle(this.addToken(req));
                    }
                    // If we don't get a new token, we are in trouble so logout.
                    return this.logoutUser();
                }),
                catchError(error => {
                    // If there is an exception calling 'refreshToken', bad news so logout.
                    this.msg.sendMessage({ command: this.alertMessage.Error });
                    return this.logoutUser();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }));

        } else {
            return this.tokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(req, token));
                }));
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        localStorage.clear();
        this.router.navigate(['/authorize']);
        return of('');
    }
}
