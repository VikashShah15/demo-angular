import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { validations } from 'src/app/Shared/Constant/validation.constants';
import { GoalModel } from 'src/app/Shared/Model/goal';
import { GoalRelatesType } from 'src/app/Shared/Model/goal';
import { GoalType } from 'src/app/Shared/Model/goal';
import { Response } from 'src/app/Shared/Model/Response';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PlanparserService } from '../../Service/planparser.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';
import { FirestoreDataService } from 'src/app/shared/services/firestore-data.service';
import { fireStoreCollectionName } from 'src/app/shared/Constant/firestore-collection.constant';

@Component({
  selector: 'app-step-three-goalsdetail',
  templateUrl: './step-three-goalsdetail.component.html',
  styleUrls: ['./step-three-goalsdetail.component.scss']
})
export class StepThreeGoalsdetailComponent implements OnInit, OnDestroy {
  public goalForm: FormGroup;
  public planId: any;
  public goals: GoalModel[];
  public goalType: GoalType[];
  private goalId = '';
  public goalIndex = 0;
  public loading = false;
  public isSubmitted = false;
  public validationConstants = validations;
  public relatesType: GoalRelatesType[];
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  private fscn = fireStoreCollectionName;
  constructor(
    private route: ActivatedRoute,
    private ps: PlanparserService,
    private router: Router,
    private msg: MessageService,
    private cs: ConfirmationService,
    private ga: GoogleAnalyticsService,
    private fds: FirestoreDataService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadForm();
  }
  loadForm(): any {
    this.goalForm = new FormGroup({
      goalTypeId: new FormControl('', Validators.required),
      goalRelatesToId: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      fundingSource: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      achievementMethod: new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      goalId: new FormControl(''),
      isDeleted: new FormControl(false),
      goalStatusId: new FormControl(''),
      planId: new FormControl('')
    });
  }

  async loadData() {
    this.isSubmitted = false;
    await this.ps.getGoalType().then((res: Response) => {
      this.goalType = res.data.goalTypes;
    });
    await this.ps.goalRelatesType().then((res: Response) => {
      this.relatesType = res.data.goalRelatesToList;
    });
    this.goalData();
  }
  goalData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      this.planId = i.id;
      this.goalId = i.goalId;
      this.subscriptions[this.subscriptions.length] = this.ps.getGoals(this.planId).subscribe((res: Response) => {
        this.goals = res.data.goals.sort((ij, j) => (ij.goalId < j.goalId ? -1 : 1));
        if (res.statusCode === 200) {
          if (this.goalId !== undefined) {
            const goal = this.goals.find(ii => ii.goalId === this.goalId);
            if (goal) {
              this.setFormData(goal);
              this.goalIndex = this.goals.indexOf(goal);
            }
          }
          else {
            this.goalIndex = 0;
            if (this.goals !== null) {
              this.router.navigate(['/planparser/step-three-goaldetail/', this.planId, 'goal', this.goals[0].goalId]);
            }
          }
        }
      });
    });
  }
  setFormData = (item) => {
    this.goalForm.get('goalTypeId').setValue(this.fetchGoalType(item.goalTypeId));
    this.goalForm.get('goalRelatesToId').setValue(this.fetchGoalRelatesType(item.goalRelatesToId));
    this.goalForm.get('description').setValue(item.description);
    this.goalForm.get('fundingSource').setValue(item.fundingSource);
    this.goalForm.get('achievementMethod').setValue(item.achievementMethod);
    this.goalForm.get('goalId').setValue(item.goalId);
    this.goalForm.get('planId').setValue(this.planId);
    this.goalForm.get('goalStatusId').setValue(item.goalStatusId);
  }

  updateGoal = () => {
    this.isSubmitted = true;
    if (this.goalForm.valid) {
      this.loading = true;
      this.subscriptions[this.subscriptions.length] = this.ps.updateGoal(this.goalId, this.goalForm.value).subscribe(res => {
        this.loading = false;
        if (res.statusCode === 200) {
          this.ga.eventEmitter(this.gAnalytics.updateGoalData, 'PlanExplainer', 'cart', 'click', 10);
          this.fds.createData({ GoalID: this.goalId, Data: this.goalForm.value }, this.fscn.addGoalDetails)
            .then(res => {
              /*do something here....
              maybe clear the form or give a success message*/
            });
          const nextGoal = this.goals[this.goalIndex + 1];
          if (nextGoal !== undefined) {
            this.router.navigate(['/planparser/step-three-goaldetail/', this.planId, 'goal', nextGoal.goalId]);
            this.loadData();
          }
          else {
            this.router.navigate(['/planparser/view-plan/', this.planId]);
          }
        } else {
          this.loading = false;
        }
      }, error => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        this.loading = false;
      });
    }
  }
  fetchGoalType = (goalTypeId) => {
    const goalType = this.goalType.find(i => i.goalTypeId === goalTypeId);
    return goalType.goalTypeId;
  }
  fetchGoalRelatesType = (goalRelatesToId) => {
    const goalRelatesType = this.relatesType.find(i => i.goalRelatesToId === goalRelatesToId);
    return goalRelatesType ? goalRelatesType.goalRelatesToId : goalRelatesType;
  }
  backOnPreviousGoal = () => {
    const previousGoal = this.goals[this.goalIndex - 1];
    this.router.navigate(['/planparser/step-three-goaldetail/', this.planId, 'goal', previousGoal.goalId]);
    this.loadData();
  }

  nextGoal = () => {
    this.verifyGoalsEditing(this.goals[this.goalIndex]);
  }
  verifyGoalsEditing = (goal) => {
    const model = this.goalForm.value;
    if (goal.description === model.description
      && goal.achievementMethod === model.achievementMethod
      && goal.fundingSource === model.fundingSource
      && goal.goalType === model.goalType) {
      const nextGoal = this.goals[this.goalIndex + 1];
      this.router.navigate(['/planparser/step-three-goaldetail/', this.planId, 'goal', nextGoal.goalId]);
      this.loadData();
    } else {
      this.openUnSavedPrompt();
    }
  }
  openUnSavedPrompt = () => {
    this.cs.confirm({
      message: 'You will lose your unsaved changes. Are you sure you want to switch to another goal?',
      accept: () => {
        this.updateGoal();
        const nextGoal = this.goals[this.goalIndex + 1];
        this.router.navigate(['/planparser/step-three-goaldetail/', this.planId, 'goal', nextGoal.goalId]);
        // this.loadData();
      }
    });
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
