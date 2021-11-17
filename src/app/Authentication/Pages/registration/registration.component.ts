import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { message } from 'src/app/Shared/Constant/alert.message';
import { pattern, validations } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../Service/auth.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public registrationForm: FormGroup;
  public validationConstants = validations;
  private alertMessage = message;
  public isSubmitted = false;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private as: AuthService,
    private router: Router,
    private msg: MessageService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(pattern.EmailPattern)]),
      terms: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  userRegistration(): any {
    this.isSubmitted = true;
    if (this.registrationForm.valid && this.registrationForm.controls.terms.value === true) {
      this.subscriptions[this.subscriptions.length] =
        this.as.requestEmailVerification(this.registrationForm.controls.email.value).subscribe((res: Response) => {

          if (res.statusCode === 200) {
            this.ga.eventEmitter(this.gAnalytics.register, 'Authentication', 'cart', 'click', 10);
            this.fds.createData(this.registrationForm.value, this.fscn.register)
          .then(res => {
            /*do something here....
            maybe clear the form or give a success message*/
          });
            const messager = this.alertMessage.RegistrationSuccess;
            this.msg.add({ severity: 'success', summary: 'Success', detail: messager });
            this.registrationForm.reset();
            this.isSubmitted = false;
          }
          else {
            this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
        }, error => {
          this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        });
    }
  }
  loadData(): any {
    localStorage.removeItem('cared-auth');
    localStorage.removeItem('cared-parse');
    localStorage.removeItem('cared-coreSupportArray');
    localStorage.removeItem('cared-capitalSupportArray');
    localStorage.removeItem('cared-capacitySupportArray');
    localStorage.removeItem('cared-personal-details');
  }
  pwd(control: AbstractControl): ValidationErrors {
    const cpwd = control.value;
    if (control.parent !== undefined) {
      const pwd = control.parent.get('password').value;
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
