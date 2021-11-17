import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as sha512 from 'js-sha512';
import { MessageService } from 'primeng/api';
import { message } from 'src/app/Shared/Constant/alert.message';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { pattern } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { Registration } from 'src/app/Shared/Model/authentication';
import { MessageServices } from 'src/app/shared/services/message.service';
import { AuthService } from '../../Service/auth.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-email-verifying',
  templateUrl: './email-verifying.component.html',
  styleUrls: ['./email-verifying.component.scss']
})
export class EmailVerifyingComponent implements OnInit, OnDestroy {
  public emailVerifyingForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  private verificationCode: any;
  private alertMessage = message;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private route: ActivatedRoute,
    private as: AuthService,
    private router: Router,
    private msg: MessageService,
    private messages: MessageServices,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.emailVerifyingForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.pattern(pattern.PasswordPattern)]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl(''),
      cpwd: new FormControl('', [Validators.required, this.pwd])
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  public verifyingEmail(): any {
    this.isSubmitted = true;
    if (this.emailVerifyingForm.valid) {
      const mainModel = this.emailVerifyingForm.value;
      const subModel: Registration = {
        firstName: mainModel.firstName,
        lastName: mainModel.lastName,
        phoneNumber: mainModel.phoneNumber,
        password: mainModel.password
      };

      subModel.password = sha512.sha512(subModel.password);
      this.userRegistration(subModel);
    }
  }
  private userRegistration(subModel): any {
    this.subscriptions[this.subscriptions.length] = this.as.registration(subModel, this.verificationCode).subscribe((res: Response) => {
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.registerNewUser, 'Authentication', 'cart', 'click', 10);
        subModel.password = '';
        this.fds.createData(subModel, this.fscn.registerNewUser)
          .then(res => {
            console.log(res);
            /*do something here....
            maybe clear the form or give a success message*/
          });
        this.messages.sendSuccessMessage(this.alertMessage.RegistrationDetailsSave);
        this.router.navigate(['/authorize']);
        this.emailVerifyingForm.reset();
        this.isSubmitted = false;
      } else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    }, error => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }
  private loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.queryParams.subscribe(i => {
      const token = i.token;
      this.subscriptions[this.subscriptions.length] = this.as.verifyEmail(token).subscribe((res: Response) => {
        if (res.statusCode === 200) {
          this.verificationCode = res.data;
        } else {
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
