import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private api: BaseService) { }
  logoutService(token): Observable<any> {
    return this.api.post(`${'v1/logout'}`, token);
  }
}
