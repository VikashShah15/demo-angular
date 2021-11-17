import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { CreateGoal, GoalModel, GoalRelatesType } from 'src/app/Shared/Model/goal';
import { GoalType } from 'src/app/Shared/Model/goal';
import { Response } from 'src/app/Shared/Model/Response';
import { MessageService } from 'primeng/api';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { MyGoalService } from '../../Service/mygoal.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit, OnDestroy {
  public addGoalForm: FormGroup;
  public goalType: GoalType[];
  public relatesType: GoalRelatesType[];
  public validationConstants = validations;
  public isSubmitted = false;
  private goalId = '';
  public goalTitle = '';
  private planId: any;
  public loading = false;
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private messageService: MessageServices,
    private ps: PlanparserService,
    private route: ActivatedRoute,
    private prs: MyGoalService,
    private msg: MessageService,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) {
    this.addGoalForm = new FormGroup({
      goalTypeId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      achievementMethod: new FormControl('', [Validators.required]),
      fundingSource: new FormControl('', [Validators.required]),
      goalRelatesToId: new FormControl('', Validators.required),
      planId: new FormControl(''),
      goalStatusId: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.getSubscriptions();
    this.getGoalStatus();
    this.getUserPlan();
    this.ps.getGoalType().then((res: Response) => {
      this.goalType = res.data.goalTypes;
    });
    this.ps.goalRelatesType().then((res: Response) => {
      this.relatesType = res.data.goalRelatesToList;
    });
  }
  getGoalStatus(): any {
    this.subscriptions[this.subscriptions.length] = this.prs.goalStatus().subscribe((res: Response) => {
      const goalStatus = res.data.goalStatues.length
        > 0 ? res.data.goalStatues.find(i => i.title.indexOf('In Progress') !== -1).goalStatusId : 0;
      this.addGoalForm.get('goalStatusId').setValue(goalStatus);
    });
  }
  getUserPlan(): any {
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe((res: Response) => {
      const activePlan = res.data.plans.find(i => i.plan.isActive === true);
      if (activePlan !== undefined) {
        this.planId = activePlan.plan.planId;
        this.addGoalForm.get('planId').setValue(this.planId);
      }
    });
  }
  getSubscriptions(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(res => {
      if (res.goalId !== undefined) {
        this.goalTitle = 'Edit Goal';
        this.goalId = res.goalId;
        this.subscriptions[this.subscriptions.length] = this.prs.getGoalData(res.goalId).subscribe((ress: Response) => {
          const goalData: GoalModel = ress.data.success;
          this.addGoalForm.get('description').setValue(goalData.description);
          this.addGoalForm.get('achievementMethod').setValue(goalData.achievementMethod);
          this.addGoalForm.get('fundingSource').setValue(goalData.fundingSource);
          this.addGoalForm.get('goalTypeId').setValue(goalData.goalTypeId);
          this.addGoalForm.get('goalRelatesToId').setValue(this.fetchGoalRelatesType(goalData.goalRelatesToId));
        });
      }
      else {
        this.goalTitle = 'Add Goal';
      }
    });
  }
  fetchGoalRelatesType(goalRelatesToId): any {
    if (this.relatesType) {
      const goalRelatesType = this.relatesType.find(i => i.goalRelatesToId === goalRelatesToId);
      return goalRelatesType ? goalRelatesType.goalRelatesToId : goalRelatesType;
    }
  }
  addAndUpdateGoal = () => {
    this.isSubmitted = true;
    if (this.addGoalForm.valid) {
      const model: CreateGoal = this.addGoalForm.value;
      model.goalTypeId = parseFloat(model.goalTypeId);
      model.goalRelatesToId = parseFloat(model.goalRelatesToId);
      if (this.goalId === '') {
        this.loading = true;
        this.createSubscription(model);
      }
      else {
        this.loading = true;
        this.updateSubscription(model);
      }
    }
  }
  createSubscription(model): any {
    this.subscriptions[this.subscriptions.length] = this.prs.createGoal(model).subscribe((res: Response) => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.addGoalData, 'Goals', 'cart', 'click', 10);
        this.fds.createData(model, this.fscn.addGoalData)
          .then(res => {
            /*do something here....
            maybe clear the form or give a success message*/
          });
        this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.router.navigate(['/my-goal/find-track-goal']);
      }
      else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    },
      error => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      });
  }
  updateSubscription(model): any {
    this.subscriptions[this.subscriptions.length] = this.prs.updateGoal(this.goalId, model).subscribe(res => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.updateGoalData, 'Goals', 'cart', 'click', 10);
        this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.router.navigate(['/my-goal/find-track-goal']);
      }
      else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    },
      error => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      });
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
