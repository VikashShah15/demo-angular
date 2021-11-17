import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Response } from 'src/app/Shared/Model/Response';
import { SupportCategory, BudgetModel, SupportSubCategory } from 'src/app/Shared/Model/budget';
import { PlanModel, PlanType } from 'src/app/Shared/Model/Plan';
import { GoalModel } from 'src/app/Shared/Model/goal';
import { PlanparserService } from '../../Service/planparser.service';
import { PdfMakesService } from '../../Service/pdf-makes.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';



@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit, OnDestroy {
  public planId: any = '';
  private planType: PlanType[];
  public planData: PlanModel;
  public budget: BudgetModel[];
  private capacitySupportArray: any = [];
  private capitalSupportArray: any = [];
  private coreSupportArray: any = [];
  private supportCategory: SupportCategory[];
  private supportSubCategory: SupportSubCategory[];
  public combinedGoals: GoalModel[];
  private combinedGoalsShortTerms: any = [];
  private combinedGoalsLongTerms: any = [];
  private totalCoreSupport = 0;
  public showPersonalDetail = false;
  public loader = true;
  public totalBudget = 0;
  public spentBudget = 0;
  public remainingBudget = 0;
  public onHoldBudget = 0;
  public initialBudget = 0;
  private TotalCapacitySupport = 0;
  private TotalCapitalSupport = 0;
  private goalType: any = [];
  private hideGoal = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private ps: PlanparserService,
    private route: ActivatedRoute,
    private router: Router,
    private pdfMakes: PdfMakesService,
    private msgs: MessageServices,
    private messageService: MessageService,
    private cs: ConfirmationService
  ) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.loadData();
  }
  async loadData() {
    this.getSubscriptions();
    await this.ps.getCategories().then((res: Response) => {
      this.supportCategory = res.data.supportCategories;
    });

    await this.ps.getSupportCategories().then((res: Response) => {
      this.supportSubCategory = res.data.supportSubCategories;
    });

    await this.ps.planType().then((res: Response) => {
      this.planType = res.data.planTypes;
    });
    await this.ps.getGoalType().then((res: Response) => {
      this.goalType = res.data.goalTypes;
    });
    setTimeout(() => {
      this.supportSubCategory.filter(i => this.supportCategory.some(o => i.supportCategoryId === o.supportCategoryId)).forEach(element => {
        element.supportCategoryId = this.supportCategory.find(i => i.supportCategoryId === element.supportCategoryId).supportCategoryId;
        element.supportCat = this.supportCategory.find(i => i.supportCategoryId === element.supportCategoryId).title;
      });
      this.getActivePlan();
      this.sumOfBudget();
      this.loader = false;
    }, 1000);
  }
  getSubscriptions(): any {
    this.msgs.sendMessage({ cmd: '/planparser/view-plan' });
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      this.planId = i.id;
    });
    this.subscriptions[this.subscriptions.length] = this.ps.getPlanId(this.planId).subscribe((res: Response) => {
      this.planData = res.data.plan;
      this.budget = res.data.budgets;
      if (this.budget.length === 0) {

      }
    });
    this.subscriptions[this.subscriptions.length] = this.ps.getGoals(this.planId).subscribe((res: Response) => {
      this.combinedGoals = res.data.goals;
      if (res.statusCode === 200 && this.combinedGoals.length === 0) {
        this.hideGoal = false;
      }
    });
  }

  redirectToUploadNewPlan = () => {
    this.cs.confirm({
      message: 'We noticed that there is already a plan active. Are you sure you want to replace the OLD plan with the NEW plan?',
      accept: () => {
        this.router.navigate(['/planparser/new-pdf-upload']);
      },
      reject: () => {

      }
    });
  }

  async downloadPDF() {
    const documentDefinition = await this.pdfMakes.getDocumentDefinition
      (
        this.planData.participantName,
        this.planData.birthDate,
        this.planData.startDate,
        this.planData.reviewDate,
        this.planData.address,
        this.planData.totalBudget,
        this.coreSupportArray,
        this.totalCoreSupport.toFixed(2),
        this.TotalCapacitySupport.toFixed(2),
        this.capacitySupportArray,
        this.capitalSupportArray,
        this.TotalCapitalSupport.toFixed(2),
        this.planData.aboutMe,
        this.planData.familyAndFriends,
        this.planData.serviceCommunity,
        this.combinedGoalsShortTerms,
        this.combinedGoalsLongTerms
      );
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition).download('CaredPlanParser-' + this.planData.participantName);
  }
  getActivePlan = () => {
    if (this.budget){
      const subcat = this.supportSubCategory.filter(i => this.budget.some(o => i.supportSubCategoryId === o.supportSubCategoryId));
      if (subcat.length > 0) {
        this.budget.forEach(element => {
          element.subCategory = subcat.find(i => i.supportSubCategoryId === element.supportSubCategoryId).title;
          element.category = subcat.find(i => i.supportSubCategoryId === element.supportSubCategoryId).supportCat;
          element.planType = this.planType.find(i => i.planTypeId === element.planTypeId).title;
        });
      }
      this.coreSupportArray = this.budget.filter(i => (i.category.indexOf('Core Supports') !== -1));
      this.capitalSupportArray = this.budget.filter(i => (i.category.indexOf('Capital Supports') !== -1));
      this.capacitySupportArray = this.budget.filter(i => (i.category.indexOf('Capacity Building Supports') !== -1));
    }
    if (this.combinedGoals) {
      this.combinedGoals.forEach(element => {
        element.goalType = this.goalType.find(i => i.goalTypeId === element.goalTypeId).title;
      });
      this.combinedGoalsShortTerms = this.combinedGoals.filter(i => (i.goalType.indexOf('Short-term goal') !== -1));
      this.combinedGoalsLongTerms = this.combinedGoals.filter(i => (i.goalType.indexOf('Medium or long-term goal') !== -1));
    }

    this.totalCoreSupport = this.coreSupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);
    this.TotalCapitalSupport = this.capitalSupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);
    this.TotalCapacitySupport = this.capacitySupportArray.reduce((prev, cur) => prev + cur.totalBudget, 0);
  }
  changeShowPersonalDetail(value): any {
    localStorage.setItem('cared-personal-details', value);
    if (value === true) {
      this.showPersonalDetail = true;
    } else {
      this.showPersonalDetail = false;
    }
  }
  sumOfBudget = () => {
    if (this.budget && this.budget.length > 0){
      for (const each of this.budget) {
        this.totalBudget = this.totalBudget + each.totalBudget;
        this.spentBudget = this.spentBudget + each.spentBudget;
        this.remainingBudget = this.remainingBudget + each.remainingBudget;
        this.onHoldBudget = this.onHoldBudget + each.onHoldBudget;
        this.initialBudget = this.initialBudget + each.initialBudget;
      }
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
