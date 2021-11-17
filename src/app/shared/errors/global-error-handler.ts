import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { AuthService } from 'src/app/Authentication/Service/auth.service';
import { fireStoreCollectionName } from '../Constant/firestore-collection.constant';
import { FirestoreDataService } from '../services/firestore-data.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private fscn = fireStoreCollectionName;
    constructor(
        private zone: NgZone,
        private fds: FirestoreDataService,
        private as: AuthService
    ) { }


    handleError(error: Error): any {
        this.zone.run(() =>
            error.message || 'Undefined client error'
        );
        if (error instanceof HttpErrorResponse) {
        } else {
            this.fds.createData({
                ErrorDescription: error.toString() ? error.toString() : JSON.stringify(error),
                ErrorTime: Date(),
                ClientData: JSON.parse(localStorage.getItem('cared-auth')).email ? JSON.parse(localStorage.getItem('cared-auth')).email : ''
            }, this.fscn.globalErrors)
                .then(res => {
                    /*do something here....
                    maybe clear the form or give a success message*/
                });
        }
    }
}
