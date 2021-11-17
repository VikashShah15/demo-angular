import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { AuthInterceptorInterceptor } from './Planparser/auth-interceptor.interceptor';
import { GlobalErrorHandler } from './shared/errors/global-error-handler';
import { HttpErrorInterceptor } from './shared/errors/http-error.interceptor';



export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },
    {
        // processes all errors
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
    },
    {
        // interceptor for HTTP errors
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true // multiple interceptors are possible
    }
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: TokenInterceptorInterceptor,
    //     multi: true
    // },
];
