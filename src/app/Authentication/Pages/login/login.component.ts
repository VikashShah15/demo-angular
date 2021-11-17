import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
import * as sha512 from 'js-sha512';
import { MessageService } from 'primeng/api';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { pattern } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { Login } from 'src/app/Shared/Model/authentication';
import { AuthService } from '../../Service/auth.service';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  private subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private as: AuthService,
    private msg: MessageService,
    private ps: PlanparserService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(pattern.EmailPattern)]),
      password: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
  }
  public userLogin(): any {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const formValue: Login = this.loginForm.value;
      formValue.password = sha512.sha512(formValue.password);
      this.userLoginData(formValue);
    }
  }
  private userLoginData(formValue): any {
    this.subscriptions[this.subscriptions.length] = this.as.login(formValue).subscribe((res: Response) => {

      if (res.statusCode === 200) {
        const decoded = jwt_decode(res.data.token.accessToken);
        localStorage.setItem('cared-auth', JSON.stringify(decoded));
        localStorage.setItem('cared-access-token', res.data.token.accessToken);
        localStorage.setItem('cared-refresh-token', res.data.token.refreshToken);
        this.router.navigate(['/dashboard']);
        this.ga.eventEmitter(this.gAnalytics.login, 'Authentication', 'cart', 'click', 10);
        formValue.password = '';
        this.fds.createData(formValue, this.fscn.login)
          .then(res => {
            /*do something here....
            maybe clear the form or give a success message*/
          });
        this.loginForm.reset();
        this.isSubmitted = false;
      } else {
        this.router.navigate(['/authorize/expire-token']);
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    }, error => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
