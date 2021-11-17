import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../Service/profile.service';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  private userId = '';
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
  loadForm(): any {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl(''),
      email: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    const decoded: any = jwt_decode(localStorage.getItem('cared-access-token'));
    this.profileForm.get('email').setValue(decoded.email);
    this.profileForm.get('firstName').setValue(decoded.firstName);
    this.profileForm.get('lastName').setValue(decoded.lastName);
    this.userId = decoded.userId;
  }
  userProfileSubmit = () => {
    if (this.profileForm.valid) {
      const value = this.profileForm.value;
      const model = {
        firstName: value.firstName,
        lastName: value.lastName,
        phoneNumber: value.phoneNumber.toString()
      };
      this.ps.profileUpdate(model, this.userId).subscribe(res => {
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.updateProfile, 'Profile', 'cart', 'click', 10);
          this.fds.createData({ UserID: this.userId, Data: model }, this.fscn.changeProfile)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
        }
      }, error => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    }
  }

}
