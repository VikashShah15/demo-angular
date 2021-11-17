import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { message } from 'src/app/Shared/Constant/alert.message';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { PlanModel, SavePlanData, PlanType } from 'src/app/Shared/Model/Plan';
import { GoalModel } from 'src/app/Shared/Model/goal';
import { SupportCategory, SupportSubCategory, BudgetModel } from 'src/app/Shared/Model/budget';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PlanparserService } from '../../Service/planparser.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-step-two-budgetdetail',
  templateUrl: './step-two-budgetdetail.component.html',
  styleUrls: ['./step-two-budgetdetail.component.scss']
})
export class StepTwoBudgetdetailComponent implements OnInit, OnDestroy {
  public budgetForm: FormGroup;
  public validationConstants = validations;
  public planType: PlanType[];
  private supportSubCategory: SupportSubCategory[];
  public category: SupportCategory[];
  public planId: any;
  private alertMessage = message;
  public isSubmitted = false;
  public formSupportSubCategories = [];
  private data: any = [];
  public loading = false;
  public returnUrl: any;
  public budgetDetailsTitle = '';
  private budgetsDetails: BudgetModel[];
  private initialTotalBudget = 0;
  private planDetail: PlanModel;
  public step: any;
  private combinedGoals: GoalModel[];
  public Loader = false;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private ps: PlanparserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cs: ConfirmationService,
    private msg: MessageService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {

  }
  ngOnInit(): any {
    this.loadData();
  }
  createBudgetItem(item): FormGroup {
    this.data = item.budgetId;
    const formGroup = this.fb.group({
      budgetId: new FormControl(item.budgetId),
      supportSubCategoryId: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      totalBudget: new FormControl(item.totalBudget, [Validators.required, Validators.min(0)]),
      spentBudget: new FormControl(item.spentBudget, [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      onholdBudget: new FormControl(item.onHoldBudget, [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      planTypeId: new FormControl('', [Validators.required]),
      initialBudget: new FormControl(item.initialBudget, [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      remainingBudget: new FormControl(''),
      isEditable: new FormControl(true),
      isConfirmed: new FormControl(item.isConfirmed)
    });
    this.createBudget(item, formGroup);
    return formGroup;
  }
  createBudget(item, formGroup): any {
    formGroup.get('category').setValue(this.fetchCategoryFromSupportCategory(item.supportSubCategoryId));
    formGroup.get('supportSubCategoryId').setValue(this.fetchSubCategoryType(item.supportSubCategoryId));
    formGroup.get('planTypeId').setValue(this.fetchPlanType(item.planTypeId));
    formGroup.get('remainingBudget').setValue(item.remainingBudget);
  }
  getbudgetFormArray(form): Array<any> {
    return form.controls.details.controls;
  }

  sameValueError(name, j): boolean {
    const budgetFormArray = this.getbudgetFormArray(this.budgetForm);
    const budget = budgetFormArray.filter(i => parseFloat(i.controls.supportSubCategoryId.value) === parseFloat(name)
      && parseFloat(name) !== null);
    if (budget.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }
  greaterThanTotalBudgetError(control: AbstractControl): ValidationErrors {
    const cpwd = control.value;
    if (control.parent !== undefined) {
      const pwd = control.parent.get('totalBudget').value;
      {
        if (cpwd > pwd) {
          return { greater: true };
        }
      }
    }
    return null;
  }
  async loadData() {
    this.Loader = true;
    this.subscriptions[this.subscriptions.length] = this.route.queryParams.subscribe(res => {
      this.returnUrl = res.returnURL;
    });
    if (this.returnUrl !== null && this.returnUrl !== undefined) {
      this.budgetDetailsTitle = 'Edit Your Budgets';
    } else {
      this.budgetDetailsTitle = 'Verify Your Budgets';
    }
    await this.ps.getCategories().then((res: Response) => {
      this.category = res.data.supportCategories;
    });
    await this.ps.getSupportCategories().then((res: Response) => {
      this.supportSubCategory = res.data.supportSubCategories;
    });
    await this.ps.planType().then((res: Response) => {
      this.planType = res.data.planTypes;
    });

    this.budgetForm = this.fb.group({
      details: this.fb.array([])
    });
    this.budgetData();
  }
  budgetData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      this.planId = i.id;
      this.subscriptions[this.subscriptions.length] = this.ps.getPlanById(this.planId).subscribe((res: Response) => {
        const budgets: BudgetModel[] = res.data.budgets;
        if (budgets.length === 0) {
          this.addNewBudget();
          this.budgetDetailsTitle = 'Add Your Budgtes';
        }
        this.planDetail = res.data.plan;
        this.initialTotalBudget = Math.floor(budgets.reduce((sum, b) => sum + b.totalBudget, 0));
        this.budgetsDetails = res.data.budgets;
        for (const each of budgets) {
          this.formSupportSubCategories.push(this.fetchCategoryBySupportCategory(each.supportSubCategoryId));
          const details = this.budgetForm.get('details') as FormArray;
          details.push(this.createBudgetItem(each));
        }
        this.getSupportSubCategory();
      });
      this.goalData();
    });
  }
  goalData(): any {
    this.formSupportSubCategories = [];
    this.subscriptions[this.subscriptions.length] = this.ps.getGoals(this.planId).subscribe(res => {
      this.combinedGoals = res.data.goals;
      if (this.combinedGoals.length === 0) {
        this.step = 2;
      }
      else {
        this.step = 3;
      }
      this.Loader = false;
    });
  }
  budgetFormSubmit = () => {
    this.isSubmitted = true;
    const checkData = this.budgetForm.value.details.find(i => i.isConfirmed === false);
    if (this.budgetForm.valid) {
      if (!checkData) {
        this.loading = true;
        if (this.returnUrl !== null && this.returnUrl !== undefined) {
          this.router.navigate(['/' + this.returnUrl]);
        } else if (this.combinedGoals.length > 0) {
          this.router.navigate(['/planparser/step-three-goaldetail', this.planId]);
        }
        else {
          this.router.navigate(['/planparser/view-plan', this.planId]);
        }
      }
      else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.ConfirmBudgetError });
      }
    }

  }
  onCategoryChange = (event, ind) => {
    this.formSupportSubCategories[ind] = this.fetchSupportCategoryByCategory(event.target.value);
  }
  fetchCategoryFromSupportCategory = (supportCategoryID) => {
    const supportCategory = this.supportSubCategory.find(i => i.supportSubCategoryId === supportCategoryID);
    const category = this.category.find(i => i.supportCategoryId === supportCategory.supportCategoryId);
    return category.supportCategoryId;
  }
  fetchSubCategoryType = (supportSubCategoryId) => {
    const subCategoryType = this.supportSubCategory.find(i => i.supportSubCategoryId === supportSubCategoryId);
    return subCategoryType.supportSubCategoryId;
  }
  fetchPlanType = (planTypeId) => {
    const planType = this.planType.find(i => i.planTypeId === planTypeId);
    return planType ? planType.planTypeId : planType;
  }
  fetchCategoryBySupportCategory = (supportCategoryID) => {
    const supportCategory = this.supportSubCategory.find(i => i.supportSubCategoryId === supportCategoryID);
    const category = this.supportSubCategory.filter(i => i.supportCategoryId === supportCategory.supportCategoryId);
    return category;
  }
  fetchSupportCategoryByCategory = (CategoryID) => {
    const category = this.supportSubCategory.filter(i => i.supportCategoryId === Number(CategoryID));
    return category;
  }
  deleteBudgetData = (budgetId, ind) => {
    this.cs.confirm({
      message: 'Are you sure you want to delete this budget?',
      accept: () => {
        if (budgetId) {
          this.subscriptions[this.subscriptions.length] = this.ps.deleteBudget(budgetId).subscribe(res => {
            if (res.statusCode === 200) {
              this.ga.eventEmitter(this.gAnalytics.deleteBudgetData, 'PlanExplainer', 'cart', 'click', 10);
              this.budgetFormArray.removeAt(ind);
              this.getSupportSubCategory();
              this.budgetCompare();
              this.loadData();
            }
          });
        } else {
          this.budgetFormArray.removeAt(ind);
        }
      }
    });
  }
  addNewBudgetData = () => {
    const formGroup = this.fb.group({
      budgetId: new FormControl(''),
      supportSubCategoryId: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      totalBudget: new FormControl('', [Validators.required, Validators.min(0)]),
      spentBudget: new FormControl('', [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      onholdBudget: new FormControl('', [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      planTypeId: new FormControl('', [Validators.required]),
      initialBudget: new FormControl('', [Validators.required, Validators.min(0), this.greaterThanTotalBudgetError]),
      remainingBudget: new FormControl(''),
      isEditable: new FormControl(false),
      isConfirmed: new FormControl(false)
    });
    formGroup.get('spentBudget').setValue(0);
    formGroup.get('onholdBudget').setValue(0);
    return formGroup;
  }
  budgetCompare = () => {
    const budgetList = [];
    if (this.budgetForm.value.details.length > 0) {
      this.budgetForm.value.details.forEach(element => {
        const budgetModel =
        {
          totalBudget: Number(element.totalBudget.toString().replace('$', '').replace(',', '')),
        };
        budgetList.push(budgetModel);
      });
      const changeBudget = Math.floor(budgetList.reduce((sum, element) => sum + parseFloat(element.totalBudget), 0));
      if (this.initialTotalBudget !== changeBudget) {
        this.planDetail.totalBudget = changeBudget;
        const model: SavePlanData = this.planDetail;
        this.ps.updatePlanDetails(this.planId, model).toPromise().then((res: Response) => {
        });
      }
    }
  }
  confirmBudgetData = (budgetId, index) => {
    const budget = this.budgetForm.value.details[index];
    if (!this.changeBudgetValue(budget.totalBudget, budget.initialBudget, budget.spentBudget, budget.onholdBudget)
      && budget.totalBudget >= 0 && budget.initialBudget >= 0 && budget.spentBudget >= 0 && budget.onholdBudget >= 0) {
      this.cs.confirm({
        message: 'Are you sure you want to confirm Budget?',
        accept: () => {

          const remaining = (Math.abs(parseInt(budget.initialBudget) - parseInt(budget.onholdBudget) - parseInt(budget.spentBudget)));
          const budgetModel =
          {
            'budgetId': budget.budgetId,
            'supportSubCategoryId': Number(budget.supportSubCategoryId),
            'planId': this.planId,
            'totalBudget': budget.totalBudget,
            'remainingBudget': Number(remaining),
            'initialBudget': budget.initialBudget,
            'onHoldBudget': budget.onholdBudget,
            'spentBudget': budget.spentBudget,
            'planTypeId': Number(budget.planTypeId),
            'isDeleted': false,
            'isConfirmed': true
          };
          this.confirmBudget(budgetModel, budgetId);
        }
      });
    }
  }
  confirmBudget(budgetModel, budgetId) {
    if (budgetId === "") {
      this.ps.createBudget(budgetModel).subscribe(res => {
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.saveBudgetData, 'PlanExplainer', 'cart', 'click', 10);
          this.fds.createData(budgetModel, this.fscn.addBudgetDetails)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.budgetCompare();
          this.loadData();
        }
      });
    } else {
      this.ps.updateBudgetData(budgetModel, budgetId).subscribe((res: Response) => {
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.updateBudgetData, 'PlanExplainer', 'cart', 'click', 10);
          this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.budgetCompare();
          this.loadData();
        }
      });
    }
  }
  addNewBudget = () => {
    const details = this.budgetForm.get('details') as FormArray;
    details.insert(0, this.addNewBudgetData());
    this.getSupportSubCategory();
  }
  getSupportSubCategory(): any {
    const details = this.budgetForm.get('details') as FormArray;
    for (let index = 1; index < details.length; index++) {
      this.formSupportSubCategories[index] = this.fetchSupportCategoryByCategory(details.value[index].category);
    }
  }
  get budgetFormArray(): FormArray {
    return this.budgetForm.get('details') as FormArray;
  }
  totalBudgetValue(totalBudget, spentBudget, onholdBudget): boolean {
    if (totalBudget !== undefined && spentBudget !== undefined && onholdBudget !== undefined) {
      if (totalBudget < (spentBudget + onholdBudget)) {
        return true;
      } else {
        return false;
      }
    }
  }
  spentBudgetValue(totalBudget, spentBudget, onholdBudget): boolean {
    if (totalBudget !== undefined && spentBudget !== undefined && onholdBudget !== undefined) {
      if (totalBudget < (spentBudget + onholdBudget)) {
        return true;
      } else {
        return false;
      }
    }
  }
  onholdBudgetValue(totalBudget, spentBudget, onholdBudget): boolean {
    if (totalBudget !== undefined && spentBudget !== undefined && onholdBudget !== undefined) {
      if (totalBudget < (spentBudget + onholdBudget)) {
        return true;
      } else {
        return false;
      }
    }
  }
  changeBudgetValue = (totalBudget, initialBudget, spentBudget, onholdBudget) => {
    if (totalBudget !== initialBudget + spentBudget + onholdBudget) {
      return true;
    }
    else {
      return false;
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
