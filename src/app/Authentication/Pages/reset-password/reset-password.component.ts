import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as sha512 from 'js-sha512';
import { MessageService } from 'primeng/api';

import { validations } from 'src/app/Shared/Constant/validation.constants';
import { pattern } from 'src/app/Shared/Constant/validation.constants';
import { message } from 'src/app/Shared/Constant/alert.message';

import { Response } from 'src/app/Shared/Model/Response';
import { ResetPassword } from 'src/app/Shared/Model/authentication';

import { AuthService } from '../../Service/auth.service';

import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public resetPasswordForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  private token = '';
  private alertMessage = message;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private sp: AuthService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService) {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.pattern(pattern.PasswordPattern)]),
      cpwd: new FormControl('', [Validators.required, this.pwd])
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  public resetPassword = () => {
    this.isSubmitted = true;
    if (this.resetPasswordForm.valid) {
      const formValue: ResetPassword = this.resetPasswordForm.value;
      formValue.newPassword = sha512.sha512(formValue.newPassword);
      formValue.cpwd = sha512.sha512(formValue.cpwd);
      this.subscriptions[this.subscriptions.length] = this.sp.resetPassword(this.token, formValue).subscribe((res: Response) => {
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.resetPassword, 'Authentication', 'cart', 'click', 10);
          formValue.newPassword = '';
          formValue.cpwd = '';
          this.fds.createData({ Token: this.token, data: formValue }, this.fscn.resetPassword)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.router.navigate(['/authorize']);
          this.resetPasswordForm.reset();
          this.isSubmitted = false;
        }
        else {
          this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
        }
      }, error => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
      });
    }
  }
  private loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.queryParams.subscribe(params => {
      this.token = params.token;
      this.subscriptions[this.subscriptions.length] = this.sp.verifyResetPasswordToken(this.token).subscribe((res: Response) => {
        if (res.statusCode !== 200) {
          this.router.navigate(['/authorize']);
          this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      }, error => {
        this.router.navigate(['/authorize/expire-token']);
        this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      });
    });
  }
  private pwd(control: AbstractControl): ValidationErrors {
    const cpwd = control.value;
    if (control.parent !== undefined) {
      const pwd = control.parent.get('newPassword').value;
      {
        if (cpwd !== pwd) {
          return { compare: true };
        }
      }
    }
    return null;
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
