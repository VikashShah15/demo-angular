import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanAndBudgetDetail } from 'src/app/Shared/Model/planandbudgetdetails';
import { Response } from 'src/app/Shared/Model/Response';
import { ConfirmationService } from 'primeng/api';
import { PlanparserService } from 'src/app/Planparser/Service/planparser.service';
import { MessageServices } from 'src/app/shared/services/message.service';
import { CommonService } from 'src/app/Shared/Services/common.service';
import { environment } from 'src/environments/environment';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private activePlanId = '';
  private selectedItem: any;
  public isOpen = false;
  public tab: any = '';
  public currentMenuItem = '';
  public myPlanExplainerActive = false;
  public isSideMenuVisible = environment.isVisibleOnProduction;
  private subscriptions: Subscription[] = [];

  // menu: any = [
  //   { id: 1, title: 'Dashboard', icon1: '/assets/images/dashboard.svg',icon2: '/assets/images/dashboard_hover.svg', link: '/dashboard' },
  //   { id: 2, title: 'Analyse My Plan', icon: '', link: '/planparser/' },
  //   { id: 3, title: 'Search & Book Service Providers', icon: '', link: '/serviceprovider/' },
  //   { id: 4, title: 'Manage my goals', icon: '', link: '/pricelist/' },
  //   // { id: 5, title: 'Logout', icon: '', link: '/dashboard' },

  // ];
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private msgs: MessageServices,
    private ps: PlanparserService,
    private route: ActivatedRoute,
    private cs: ConfirmationService,
    private cms: CommonService
  ) { }

  ngOnInit(): void {
    this.getUserPlan();
    this.getMessage();
  }
  getUserPlan(): any {
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe((res: Response) => {
      const plans: PlanAndBudgetDetail[] = res.data.plans;
      const activeplan = plans.find(i => i.plan.isActive === true);
      if (activeplan !== undefined && activeplan.plan !== undefined) {
        this.activePlanId = activeplan.plan.planId;
      }
    });
  }
  getMessage(): any {
    this.subscriptions[this.subscriptions.length] = this.msgs.getMessage().subscribe(res => {
      if (res.cmd === '/planparser' || res.cmd === '/planparser/view-plan') {
        this.currentMenuItem = 'MyPlan';
        this.tab = 'MyPlan';
        this.getActivePlan();
      } else if (res.cmd === '/invoices') {
        this.currentMenuItem = 'MyPlan';
        this.tab = 'MyPlan';
      } else if (res.cmd === '/planassist') {
        this.currentMenuItem = 'MyPlan';
        this.tab = 'MyPlan';
      } else if (res.cmd === '/serviceprovider') {
        this.currentMenuItem = 'MyServices';
        this.tab = 'MyServices';
      } else if (res.cmd === '/upcoming-booking') {
        this.currentMenuItem = 'MyServices';
        this.tab = 'MyServices';
      } else if (res.cmd === '/past-booking') {
        this.currentMenuItem = 'MyServices';
        this.tab = 'MyServices';
      } else if (res.cmd === '/onboard-service-provider') {
        this.currentMenuItem = 'MyServices';
        this.tab = 'MyServices';
      } else if (res.cmd === '/add-goal') {
        this.currentMenuItem = 'MyGoals';
        this.tab = 'MyGoals';
      } else if (res.cmd === '/find-track-goal') {
        this.currentMenuItem = 'MyGoals';
        this.tab = 'MyGoals';
      } else if (res.cmd === '/add-task') {
        this.currentMenuItem = 'MyToDoList';
        this.tab = 'MyToDoList';
      } else if (res.cmd === '/find-modify-task') {
        this.currentMenuItem = 'MyToDoList';
        this.tab = 'MyToDoList';
      } else if (res.cmd === '/add-document') {
        this.currentMenuItem = 'MyDocuments';
        this.tab = 'MyDocuments';
      } else if (res.cmd === '/view-document') {
        this.currentMenuItem = 'MyDocuments';
        this.tab = 'MyDocuments';
      } else if (res.cmd === '/add-user') {
        this.currentMenuItem = 'MyTeam';
        this.tab = 'MyTeam';
      } else if (res.cmd === '/monthly-expenses') {
        this.currentMenuItem = 'MyReport';
        this.tab = 'MyReport';
      } else if (res.cmd === '/dashboard') {
        this.tab = 'Dashboard';
      }
    });
  }

  logout(): any {
    this.cs.confirm({
      message: 'Are you sure you want to logout?',
      accept: () => {
        const token = localStorage.getItem('cared-auth');
        this.subscriptions[this.subscriptions.length] = this.cms.logoutService(token).subscribe(res => {
        });
        localStorage.clear();
        this.router.navigate(['/authorize']);
      },
      reject: () => {

      }
    });
  }

  listClick(event, newValue): any {
    this.selectedItem = newValue;
  }
  openSideMenu(): any {
    this.isOpen = !this.isOpen;
    if (this.isOpen === true) {
      this.renderer.addClass(document.body, 'sidebar-folded');
    } else {
      this.renderer.removeClass(document.body, 'sidebar-folded');
    }
  }


  onSideMenuItemClick(check): any {
    if (this.router.url.indexOf('planparser/view-plan/') === -1) {
      this.myPlanExplainerActive = false;
    }
    if (check === 1) {
      this.tab = 'Dashboard';
    } else if (check === 2) {
      this.tab = 'MyPlan';
    } else if (check === 3) {
      this.tab = 'MyServices';
    } else if (check === 4) {
      this.tab = 'MyGoals';
    } else if (check === 5) {
      this.tab = 'MyToDoList';
    } else if (check === 6) {
      this.tab = 'MyDocuments';
    } else if (check === 7) {
      this.tab = 'MyTeam';
    } else if (check === 8) {
      this.tab = 'MyReport';
    } else if (check === 9) {
      this.tab = 'Logout';
    }
    else {
      this.tab = 'All';
    }
  }

  expandCollapsedSideMenu(value): any {
    if (value === 'MyPlan' && this.currentMenuItem !== 'MyPlan') {
      this.currentMenuItem = 'MyPlan';
    } else if (value === 'MyServices' && this.currentMenuItem !== 'MyServices') {
      this.currentMenuItem = 'MyServices';
    } else if (value === 'MyGoals' && this.currentMenuItem !== 'MyGoals') {
      this.currentMenuItem = 'MyGoals';
    } else if (value === 'MyToDoList' && this.currentMenuItem !== 'MyToDoList') {
      this.currentMenuItem = 'MyToDoList';
    } else if (value === 'MyDocuments' && this.currentMenuItem !== 'MyDocuments') {
      this.currentMenuItem = 'MyDocuments';
    } else if (value === 'MyTeam' && this.currentMenuItem !== 'MyTeam') {
      this.currentMenuItem = 'MyTeam';
    } else if (value === 'MyReport' && this.currentMenuItem !== 'MyReport') {
      this.currentMenuItem = 'MyReport';
    } else {
      this.currentMenuItem = 'All';
    }
  }

  getActivePlan(): any {
    this.myPlanExplainerActive = true;
    const route = this.router.url;
    this.subscriptions[this.subscriptions.length] = this.ps.getUserPlan().subscribe(res => {
      const plans = res.data.plans;
      const activeplan = plans.find(i => i.plan.isActive === true);
      if (activeplan !== undefined) {
        this.activePlanId = activeplan.plan.planId;
        if (route !== '/planparser/new-pdf-upload' && this.activePlanId !== '') {
          this.router.navigate(['planparser/view-plan/', this.activePlanId]);
        }
      }
      else {
        this.router.navigate(['planparser/new-pdf-upload/']);
      }
    });
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'sidebar-folded');
    unsubscribeCollection(this.subscriptions);
  }
}
