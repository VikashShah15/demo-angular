import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GoalRelatesType, GoalType, GoalModel } from 'src/app/Shared/Model/goal';
import { Response } from 'src/app/Shared/Model/Response';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { MyGoalService } from '../../Service/mygoal.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';

@Component({
  selector: 'app-find-track-goal',
  templateUrl: './find-track-goal.component.html',
  styleUrls: ['./find-track-goal.component.scss']
})
export class FindTrackGoalComponent implements OnInit, OnDestroy {

  public combinedGoals: GoalModel[];
  private goalType: GoalType[];
  private relatesType: GoalRelatesType[];
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  constructor(
    private messageService: MessageServices,
    private ps: PlanparserService,
    private router: Router,
    private cs: ConfirmationService,
    private prs: MyGoalService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/find-track-goal' });
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe((res: Response) => {
      const activePlan = res.data.plans.find(i => i.plan.isActive === true);
      if (activePlan !== undefined) {
        this.subscriptions[this.subscriptions.length] = this.ps.getGoals(activePlan.plan.planId).subscribe((ress: Response) => {
          this.combinedGoals = ress.data.goals;
        });
      }
    });
    this.ps.getGoalType().then((res: Response) => {
      this.goalType = res.data.goalTypes;
    });
    this.ps.goalRelatesType().then((res: Response) => {
      this.relatesType = res.data.goalRelatesToList;
    });
  }
  fetchGoalType(goalTypeId): any {
    const goalType = this.goalType.find(i => i.goalTypeId === goalTypeId);
    return goalType.title;
  }
  fetchGoalRelatesType(goalRelatesToId): any {
    const goalRelatesType = this.relatesType.find(i => i.goalRelatesToId === goalRelatesToId);
    return goalRelatesType ? goalRelatesType.title : goalRelatesType;
  }
  deleteGoalData(goalId): any {
    this.cs.confirm({
      message: 'Are you sure you want to delete goal?',
      accept: () => {
        this.subscriptions[this.subscriptions.length] = this.prs.deleteGoalData(goalId).subscribe((res: Response) => {
          if (res.statusCode === 200) {
            this.ga.eventEmitter(this.gAnalytics.deleteGoalData, 'Goals', 'cart', 'click', 10);
            this.loadData();
          }
        });
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
