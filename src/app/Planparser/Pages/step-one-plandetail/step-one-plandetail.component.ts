import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/response';
import { PlanModel, SavePlanData } from 'src/app/Shared/Model/plan';
import { BudgetModel } from 'src/app/Shared/Model/budget';
import { PlanparserService } from '../../Service/planparser.service';
import { MessageService } from 'primeng/api';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';



@Component({
  selector: 'app-step-one-plandetail',
  templateUrl: './step-one-plandetail.component.html',
  styleUrls: ['./step-one-plandetail.component.scss']
})
export class StepOnePlandetailComponent implements OnInit, OnDestroy {
  public PlanForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  public planId: any;
  public loading = false;
  public returnUrl: any;
  public planDetailsTitle = '';
  public errorForStartDate: any = { isError: false, errorMessage: '' };
  public errorForEndDate: any = { isError: false, errorMessage: '' };
  public newPlan = false;
  public step: any;
  public btnShow = true;
  private sumOfBudget = 0;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private msg: MessageService,
    private ps: PlanparserService,
    private route: ActivatedRoute,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.loadForm();
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadForm(): any {
    this.PlanForm = new FormGroup({
      participantName: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      ndisNumber: new FormControl('', [Validators.required]),
      displayId: new FormControl('', [Validators.required]),
      reviewDate: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required, this.birthDatenotgreater]),
      totalBudget: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      aboutMe: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      familyAndFriends: new FormControl('', [Validators.maxLength(5000)]),
      serviceCommunity: new FormControl('', [Validators.maxLength(5000)]),
      postCode: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      planId: new FormControl('')
    });
  }

  birthDatenotgreater(control: AbstractControl): ValidationErrors {
    const currentDate = new Date();
    const pwd = control.value;
    if (currentDate < pwd) {
      return { greater: true };
    }
    return null;
  }
  compareEndDates = () => {
    if (new Date(this.PlanForm.controls.endDate.value) < new Date(this.PlanForm.controls.startDate.value)) {
      this.errorForEndDate = { isError: true, errorMessage: this.validationConstants.EndDateNotGreater };
      this.errorForStartDate = { isError: false, errorMessage: '' };
    } else {
      this.errorForEndDate = { isError: false, errorMessage: '' };
      this.errorForStartDate = { isError: false, errorMessage: '' };
    }
  }
  compareStartDates = () => {
    if (new Date(this.PlanForm.controls.startDate.value) > new Date(this.PlanForm.controls.endDate.value)) {
      this.errorForStartDate = { isError: true, errorMessage: this.validationConstants.StartDateNotGreater };
      this.errorForEndDate = { isError: false, errorMessage: '' };
    } else {
      this.errorForStartDate = { isError: false, errorMessage: '' };
      this.errorForEndDate = { isError: false, errorMessage: '' };
    }
  }

  loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.queryParams.subscribe(res1 => {
      this.returnUrl = res1.returnURL;
    });
    this.newPlan = this.router.url.indexOf('new-plandetail') !== -1;
    if (this.router.url.indexOf('new-plandetail') === -1) {
      this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
        this.planId = i.id;
        this.ps.getPlanId(this.planId).subscribe((res: Response) => {
          const budget: BudgetModel[] = res.data.budgets;
          if (budget.length > 0) {
            for (const each of budget) {
              this.sumOfBudget = this.sumOfBudget + each.totalBudget;
            }
          }
        });
        this.getPlanFormValue();
      });
    } else {

    }
    this.verifyPlan();
  }
  verifyPlan(): any {
    if (this.returnUrl !== null && this.returnUrl !== undefined && this.router.url.indexOf('new-plandetail') === -1) {
      this.planDetailsTitle = 'Edit Your Plan Details';
      this.btnShow = false;
    }
    else if (this.router.url.indexOf('new-plandetail') !== -1) {
      this.planDetailsTitle = 'Add Your Plan Details';
      this.step = 2;
      this.PlanForm.get('displayId').setValidators([]);
      this.PlanForm.get('displayId').updateValueAndValidity();
    } else if (this.router.url.indexOf('new-plandetail') === -1) {
      this.planDetailsTitle = 'Verify Your Plan Details';
      this.step = 3;
    }
  }
  getPlanFormValue(): any {
    this.subscriptions[this.subscriptions.length] = this.ps.getPlanById(this.planId).subscribe((res: Response) => {
      const planDetails: PlanModel = res.data.plan;
      this.PlanForm.get('participantName').setValue(planDetails.participantName);
      this.PlanForm.get('startDate').setValue(planDetails.startDate ? new Date(moment.utc(planDetails.startDate).format()) : '');
      this.PlanForm.get('endDate').setValue(planDetails.endDate ? new Date(moment.utc(planDetails.endDate).format()) : '');
      this.ndisNumber(planDetails);
      this.PlanForm.get('displayId').setValue(planDetails.displayId);
      this.PlanForm.get('birthDate').setValue(planDetails.birthDate ? new Date(moment.utc(planDetails.birthDate).format()) : '');
      this.PlanForm.get('totalBudget').setValue(planDetails.totalBudget);
      this.PlanForm.get('address').setValue(planDetails.address);
      this.PlanForm.get('aboutMe').setValue(planDetails.aboutMe);
      this.PlanForm.get('familyAndFriends').setValue(planDetails.familyAndFriends);
      this.PlanForm.get('serviceCommunity').setValue(planDetails.serviceCommunity);
      this.PlanForm.get('planId').setValue(planDetails.planId);
      this.PlanForm.get('reviewDate').setValue(planDetails.reviewDate ? new Date(moment.utc(planDetails.reviewDate).format()) : '');
      planDetails.postCode === 0 ? this.PlanForm.get('postCode').setValue('') : this.PlanForm.get('postCode').setValue(planDetails.postCode);
    });
  }
  ndisNumber(planDetails): any {
    if (planDetails.ndisNumber.indexOf('NDIS') !== -1) {
      this.PlanForm.get('ndisNumber').setValue(planDetails.ndisNumber.split('NDIS Number:')[1]);
    }
    else {
      this.PlanForm.get('ndisNumber').setValue(planDetails.ndisNumber);
    }
  }
  planDetailSubmit = () => {
    this.isSubmitted = true;
    if (this.PlanForm.valid) {
      if (this.router.url.indexOf('new-plandetail') === -1) {
        this.loading = true;
        if (this.sumOfBudget !== this.PlanForm.value.totalBudget && this.sumOfBudget !== 0) {
          this.PlanForm.value.totalBudget = this.sumOfBudget;
        }
        this.updatePlanDetail();
      } else {
        this.savePlan();
      }
    }
  }
  savePlan(): any {
    this.loading = true;
    const model: SavePlanData = this.PlanForm.value;
    this.subscriptions[this.subscriptions.length] = this.ps.savePlans(model).subscribe((res: Response) => {
      this.loading = false;
      if (res.statusCode === 200) {
        if (this.returnUrl !== null && this.returnUrl !== undefined) {
          this.router.navigate(['/' + this.returnUrl]);
        } else {
          this.ga.eventEmitter(this.gAnalytics.savePlanData, 'PlanExplainer', 'cart', 'click', 10);
          this.fds.createData(model, this.fscn.addPlanDetails)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.router.navigate(['/planparser/step-two-budgetdetail', res.data.planId]);
        }
      } else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
        this.loading = false;
      }
    }, error => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      this.loading = false;
    });
  }
  updatePlanDetail(): any {
    const model: SavePlanData = this.PlanForm.value;
    this.subscriptions[this.subscriptions.length] = this.ps.updatePlanDetails(this.planId, model).subscribe((res: Response) => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.updatePlanData, 'PlanExplainer', 'cart', 'click', 10);
        if (this.returnUrl !== null && this.returnUrl !== undefined) {
          this.router.navigate(['/' + this.returnUrl]);
        } else {
          this.router.navigate(['/planparser/step-two-budgetdetail', this.planId]);
        }
      } else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
        this.loading = false;
      }
    }, error => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      this.loading = false;
    });
  }
  checkNumberFieldLength = (elem) => {
    if (elem.length > 4) {
      elem = elem.slice(0, 4);
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
