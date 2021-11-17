import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { Response } from 'src/app/Shared/Model/Response';
import { GoalModel, GoalTrackingData, GoalType } from 'src/app/Shared/Model/goal';
import { MessageService } from 'primeng/api';
import { MyGoalService } from '../../Service/mygoal.service';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-add-track-goal',
  templateUrl: './add-track-goal.component.html',
  styleUrls: ['./add-track-goal.component.scss']
})
export class AddTrackGoalComponent implements OnInit, OnDestroy {
  public addTrackGoalForm: FormGroup;
  public validationConstants = validations;
  public isSubmitted = false;
  public goalId: any;
  private goalTrackingId = '';
  public trackGoalTitle = 'Add Track Goal';
  public loading = false;
  public goalData: GoalModel;
  private goalType: GoalType[];
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService,
    private prs: MyGoalService,
    private ps: PlanparserService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService) {

  }
  async ngOnInit() {
    this.loadData();
  }
  loadData(): any {
    this.addTrackGoalForm = new FormGroup({
      goalTrackingId: new FormControl(''),
      goalTrackingDate: new FormControl(new Date(), [Validators.required]),
      description: new FormControl('', [Validators.required]),
      performanceScore: new FormControl('', [Validators.required]),
      satisfactionScore: new FormControl('', [Validators.required]),
      goalId: new FormControl(),
    });
    this.subscriptionLength();
  }
  subscriptionLength(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      if (i.goalId !== undefined) {
        this.subscriptions[this.subscriptions.length] = this.prs.getGoalData(i.goalId).subscribe((res: Response) => {
          this.goalData = res.data.success;
        });
        this.ps.getGoalType().then((res: Response) => {
          this.goalType = res.data.goalTypes;
        });
      }
      if (i.goalId !== undefined && i.goalTrackId !== undefined) {

        this.trackGoalTitle = 'Edit Track Goal';
        this.goalId = i.goalId;
        this.goalTrackingId = i.goalTrackId;
        this.getGoalTract(i);
      } else if (i.goalId !== undefined) {
        this.goalId = i.goalId;
        this.addTrackGoalForm.get('goalId').setValue(i.goalId);
      }
      else {
        this.trackGoalTitle = 'Add Track Goal';
      }
    });
  }
  getGoalTract(i): any {
    this.subscriptions[this.subscriptions.length] = this.prs.getGoalTractById(i.goalTrackId).subscribe((res: Response) => {
      this.addTrackGoalForm.get('goalTrackingId').setValue(res.data.success.goalTrackingId);
      this.addTrackGoalForm.get('goalTrackingDate')
        .setValue(res.data.success.goalTrackingDate ? new Date(moment.utc(res.data.success.goalTrackingDate).format()) : '');
      this.addTrackGoalForm.get('description').setValue(res.data.success.description);
      this.addTrackGoalForm.get('performanceScore').setValue(res.data.success.performanceScore.toString());
      this.addTrackGoalForm.get('goalId').setValue(res.data.success.goalId);
      this.addTrackGoalForm.get('satisfactionScore').setValue(res.data.success.satisfactionScore.toString());
    });
  }
  fetchGoalType(goalTypeId): any {
    if (this.goalType) {
      const goalTypeData = this.goalType.find(i => i.goalTypeId === goalTypeId);
      return goalTypeData ? goalTypeData.title : goalTypeData;
    }
  }
  saveTrackGoal(): any {
    this.isSubmitted = true;
    if (this.addTrackGoalForm.valid) {
      const model: GoalTrackingData = this.addTrackGoalForm.value;
      model.performanceScore = parseInt(model.performanceScore, 10);
      model.satisfactionScore = parseInt(model.satisfactionScore, 10);
      if (this.goalTrackingId === '') {
        this.loading = true;
        this.createGoalTracking(model);
      } else {
        this.loading = true;
        this.updateGoalTrackingData(model);
      }
    }
  }
  createGoalTracking(model): any {
    this.subscriptions[this.subscriptions.length] = this.prs.createGoalTracking(model).subscribe(res => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.addTrackGoal, 'Goals', 'cart', 'click', 10);
        this.fds.createData(model, this.fscn.addTrackGoalData)
          .then(res => {
            /*do something here....
            maybe clear the form or give a success message*/
          });
        this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.router.navigate(['/my-goal/track-my-goal', this.goalId]);
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
  updateGoalTrackingData(model): any {
    this.subscriptions[this.subscriptions.length] = this.prs.updateGoalTrackingData(this.goalTrackingId, model).subscribe(res => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.ga.eventEmitter(this.gAnalytics.updateTrackGoal, 'Goals', 'cart', 'click', 10);
        this.msg.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.router.navigate(['/my-goal/track-my-goal/', this.goalId]);
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
