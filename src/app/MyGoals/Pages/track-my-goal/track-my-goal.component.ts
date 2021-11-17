import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Response } from 'src/app/Shared/Model/Response';
import { GoalModel, GoalTrackingData, GoalType } from 'src/app/Shared/Model/goal';
import { ConfirmationService } from 'primeng/api';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { MyGoalService } from '../../Service/mygoal.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';

@Component({
  selector: 'app-track-my-goal',
  templateUrl: './track-my-goal.component.html',
  styleUrls: ['./track-my-goal.component.scss']
})
export class TrackMyGoalComponent implements OnInit, OnDestroy {
  public goalTrackDetails: GoalTrackingData[];
  public goalId: any;
  public goalData: GoalModel;
  private goalType: GoalType[];
  private subscriptions: Subscription[] = [];
  private gAnalytics = gaMessage;
  constructor(
    private ps: PlanparserService,
    private prs: MyGoalService,
    private cs: ConfirmationService,
    private route: ActivatedRoute,
    private ga: GoogleAnalyticsService
  ) {

  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      if (i.goalId !== undefined) {
        this.goalId = i.goalId;
        this.subscriptions[this.subscriptions.length] = this.prs.getGoalTrackingData(i.goalId).subscribe((res: Response) => {
          this.goalTrackDetails = res.data.goalTrackings;
        });
        this.subscriptions[this.subscriptions.length] = this.prs.getGoalData(i.goalId).subscribe((res: Response) => {
          this.goalData = res.data.success;
        });
        this.ps.getGoalType().then((res: Response) => {
          this.goalType = res.data.goalTypes;
        });
      }
    });
  }
  fetchGoalType(goalTypeId): any {
    if (this.goalType) {
      const goalTypeData = this.goalType.find(i => i.goalTypeId === goalTypeId);
      return goalTypeData ? goalTypeData.title : goalTypeData;
    }
  }
  deleteTrackGoal(goalTrackingId): any {
    this.cs.confirm({
      message: 'Are you sure you want to delete this goaltracking?',
      accept: () => {
        if (goalTrackingId) {
          this.subscriptions[this.subscriptions.length] = this.prs.deleteGoalTrackingData(goalTrackingId).subscribe((res: Response) => {
            if (res.statusCode === 200) {
              this.ga.eventEmitter(this.gAnalytics.deleteTrackGoalData, 'Goals', 'cart', 'click', 10);
              this.loadData();
            }
          });
        }
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
