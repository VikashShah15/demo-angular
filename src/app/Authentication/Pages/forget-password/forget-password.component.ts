import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { pattern, validations } from 'src/app/Shared/Constant/validation.constants';
import { message } from 'src/app/Shared/Constant/alert.message';
import { Response } from 'src/app/Shared/Model/Response';
import { AuthService } from '../../Service/auth.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  public forgetPasswordForm: FormGroup;
  public validationConstants = validations;
  private alertMessage = message;
  public isSubmitted = false;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  constructor(private ap: AuthService, private msg: MessageService, private ga: GoogleAnalyticsService) {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(pattern.EmailPattern)])
    });
  }
  ngOnInit(): void {
  }
  public changePassword(): any {
    this.isSubmitted = true;
    if (this.forgetPasswordForm.valid) {
      this.subscriptions[this.subscriptions.length] = this.ap.forgetPassword(this.forgetPasswordForm.controls.email.value)
        .subscribe((res: Response) => {
          if (res.statusCode === 200) {
            this.ga.eventEmitter(this.gAnalytics.changePassword, 'Authentication', 'cart', 'click', 10);
            this.msg.add({ severity: 'success', summary: 'Success', detail: this.alertMessage.ForgetPasswordSuccess });
            this.forgetPasswordForm.reset();
            this.isSubmitted = false;
          }
          else {
            this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.ForgetPasswordUnsuccess });
          }
        }, error => {
          this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.ForgetPasswordUnsuccess });
        });
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }

}
