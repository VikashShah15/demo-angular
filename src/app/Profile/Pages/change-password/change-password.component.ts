import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as sha512 from 'js-sha512';
import { pattern, validations } from 'src/app/Shared/Constant/validation.constants';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../Service/profile.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public changePasswordForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private ps: ProfileService,
    private router: Router,
    private msg: MessageService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.loadForm();
  }
  ngOnInit(): void {
  }
  loadForm(): any {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(pattern.PasswordPattern)]),
      cpwd: new FormControl('', [Validators.required, this.pwd]),
    });
  }

  changePasswordSubmit = () => {
    this.isSubmitted = true;
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      formValue.oldPassword = sha512.sha512(formValue.oldPassword);
      formValue.newPassword = sha512.sha512(formValue.newPassword);
      formValue.cpwd = sha512.sha512(formValue.cpwd);
      this.subscriptions[this.subscriptions.length] = this.ps.changePassword(formValue).subscribe(res => {
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.changePassword, 'Profile', 'cart', 'click', 10);
          formValue.oldPassword = '';
          formValue.newPassword = '';
          formValue.cpwd = '';
          this.fds.createData(formValue, this.fscn.changePassword)
            .then(res => {

              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.changePasswordForm.reset();
          this.isSubmitted = false;
        }
        else {
          this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      }, error => {
        if (error.statusCode === 400) {
          this.msg.add({ severity: 'error', summary: 'Error', detail: error.message });
        }
      });
    }
  }

  pwd(control: AbstractControl): ValidationErrors {
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
