import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BudgetModel } from 'src/app/Shared/Model/Budget';
import { PlanModel } from 'src/app/Shared/Model/Plan';
import { PlanAndBudgetDetail } from 'src/app/Shared/Model/planandbudgetdetails';
import { Response } from 'src/app/Shared/Model/Response';
import { SupportCategory } from 'src/app/Shared/Model/budget';
import { SupportSubCategory } from 'src/app/Shared/Model/budget';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { gaMessage } from 'src/app/shared/Constant/GoogleAnalytics.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public data: any;
  public dataSet: any;
  public value: any;
  public endDate = new Date();
  public startDate = new Date();
  public planId: any = '';
  public planData: PlanModel;
  private CapacitySupportArray: any = [];
  private CapitalSupportArray: any = [];
  private CoreSupportArray: any = [];
  public budget: BudgetModel[];
  private supportCategory: SupportCategory[];
  private supportSubCategory: SupportSubCategory[];
  private TotalCoreSupport = 0;
  private TotalCapacitySupport = 0;
  private TotalCapitalSupport = 0;
  public Loader = true;
  private gAnalytics = gaMessage;
  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageServices,
    private ps: PlanparserService,
    private router: Router,
    private ga: GoogleAnalyticsService
  ) {
  }
  ngOnInit(): any {
    this.loadData();
    this.getUserPlan();
  }
  findPlanProgress = (startDate: Date, endDate: Date) => {
    const currentDate = new Date();
    const day = Math.round(((currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100);
    this.value = day;
  }

  async loadData() {
    this.messageService.sendMessage({ cmd: '/dashboard' });
    await this.ps.getCategories().then((res: Response) => {
      this.supportCategory = res.data.supportCategories;
    });

    await this.ps.getSupportCategories().then((res: Response) => {
      this.supportSubCategory = res.data.supportSubCategories;
    });
  }
  getUserPlan(): any {
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe((res: Response) => {
      const plans: PlanAndBudgetDetail[] = res.data.plans;
      const activeplan = plans.find(i => i.plan.isActive === true);
      if (activeplan !== undefined) {
        this.startDate = new Date(activeplan.plan.startDate);
        this.endDate = new Date(activeplan.plan.endDate);
        this.findPlanProgress(this.startDate, this.endDate);

        this.planId = activeplan.plan.planId;
        this.subscriptions[this.subscriptions.length] = this.ps.getPlanId(this.planId).subscribe((ress: Response) => {
          this.Loader = false;
          this.planData = ress.data.plan;
          this.budget = ress.data.budgets;
          this.supportSubCategory.filter(i => this.supportCategory.some(o => i.supportCategoryId === o.supportCategoryId))
            .forEach(element => {
              element.supportCategoryId = this.supportCategory
                .find(i => i.supportCategoryId === element.supportCategoryId).supportCategoryId;
              element.supportCategoryTitle = this.supportCategory
                .find(i => i.supportCategoryId === element.supportCategoryId).title;
            });
          this.getActivePlan();
        });
      }
      this.Loader = false;
    }, error => {
      this.Loader = false;
    });
  }

  getActivePlan(): any {
    const subcat = this.supportSubCategory.filter(i => this.budget.some(o => i.supportSubCategoryId === o.supportSubCategoryId));
    if (subcat.length > 0) {
      this.budget.forEach(element => {
        element.subCategory = subcat.find(i => i.supportSubCategoryId === element.supportSubCategoryId).title;
        element.category = subcat.find(i => i.supportSubCategoryId === element.supportSubCategoryId).supportCategoryTitle;
      });
    }

    this.CoreSupportArray = this.budget.filter(i => (i.category.indexOf('Core Supports') !== -1));
    this.CapitalSupportArray = this.budget.filter(i => (i.category.indexOf('Capital Supports') !== -1));
    this.CapacitySupportArray = this.budget.filter(i => (i.category.indexOf('Capacity Building Supports') !== -1));

    this.TotalCoreSupport = this.CoreSupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);
    this.TotalCapitalSupport = this.CapitalSupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);
    this.TotalCapacitySupport = this.CapacitySupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);

    const spentCoreSupport = this.CoreSupportArray.reduce((prev, cur) => prev + cur.spentBudget, 0);
    const spentCapitalSupport = this.CapitalSupportArray.reduce((prev, cur) => prev + cur.spentBudget, 0);
    const spentCapacitySupport = this.CapacitySupportArray.reduce((prev, cur) => prev + cur.spentBudget, 0);

    const remainingCoreSupport = this.TotalCoreSupport - spentCoreSupport;
    const remainingCapitalSupport = this.TotalCapitalSupport - spentCapitalSupport;
    const remainingCapacitySupport = this.TotalCapacitySupport - spentCapacitySupport;

    this.chartDisplay(this.TotalCoreSupport.toFixed(), this.TotalCapitalSupport.toFixed(),
      this.TotalCapacitySupport.toFixed(), remainingCoreSupport, remainingCapitalSupport, remainingCapacitySupport);
  }
  chartDisplay(core, capital, capacity, remainingCoreSupport, remainingCapitalSupport, remainingCapacitySupport): any {
    this.data = {
      labels: ['Core Support', 'Capital Support', 'Capacity Building'],
      datasets: [
        {
          data: [core, capital, capacity],
          backgroundColor: [
            '#fbaf11',
            '#da1a5d',
            '#13213D'
          ],
          hoverBackgroundColor: [
            '#fbaf11',
            '#da1a5d',
            '#13213D'
          ]
        }]
    };
    this.dataSet = {
      labels: ['Core Support', 'Capital Support', 'Capacity Building'],
      datasets: [
        {
          label: 'Total Budget',
          backgroundColor: '#fbaf11',
          borderColor: '#fbaf11',
          data: [core, capital, capacity]
        },
        {
          label: 'Remaining Budget',
          backgroundColor: '#da1a5d',
          borderColor: '#da1a5d',
          data: [remainingCoreSupport, remainingCapitalSupport, remainingCapacitySupport]
        }
      ]
    };

  }
  gotoPlanData(){
    this.ga.eventEmitter(this.gAnalytics.redirectViewPlan, 'Dashboard', 'cart', 'click', 10);
  }
  redirectToInvoice(){
    this.ga.eventEmitter(this.gAnalytics.redirectToInvoice, 'Dashboard', 'cart', 'click', 10);
  }
  redirectToGoals(){
    this.ga.eventEmitter(this.gAnalytics.redirectToGoals, 'Dashboard', 'cart', 'click', 10);
  }
  redirectToAppointments(){
    this.ga.eventEmitter(this.gAnalytics.redirectToAppointments, 'Dashboard', 'cart', 'click', 10);
  }
  redirectToMyserviceProvider(){
    this.ga.eventEmitter(this.gAnalytics.redirectToMyserviceProvider, 'Dashboard', 'cart', 'click', 10);

  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
