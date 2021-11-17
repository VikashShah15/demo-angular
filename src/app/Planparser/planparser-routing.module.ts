import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyComponent } from './Pages/privacy/privacy.component';
import { ParserComponent } from './Pages/parser/parser.component';
import { ServiceproviderComponent } from './Pages/serviceprovider/serviceprovider.component';
import { PlanFundedGoalsComponent } from './Pages/plan-funded-goals/plan-funded-goals.component';
import { PlanFundedComponent } from './Pages/plan-funded/plan-funded.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { FeedbackComponent } from './Pages/feedback/feedback.component';
import { ConfirmationMessageComponent } from './Pages/confirmation-message/confirmation-message.component';
import { StepOnePlandetailComponent } from './Pages/step-one-plandetail/step-one-plandetail.component';
import { StepTwoBudgetdetailComponent } from './Pages/step-two-budgetdetail/step-two-budgetdetail.component';
import { ViewPlanComponent } from './Pages/view-plan/view-plan.component';
import { StepThreeGoalsdetailComponent } from './Pages/step-three-goalsdetail/step-three-goalsdetail.component';
import { PraserGuard } from './parser.guard';

const routes: Routes = [
  {
    path: 'Privacy',
    component: PrivacyComponent
  },
  {
    path: '',
    component: ParserComponent
  },
  {
    path: 'new-pdf-upload',
    component: ParserComponent
  },
  {
    path: 'SearchProviders',
    component: ServiceproviderComponent
  },
  {
    path: 'Plan-Funded-Goals',
    component: PlanFundedGoalsComponent
  },
  {
    path: 'Plan-Funded',
    component: PlanFundedComponent
  },
  {
    path: 'User-Profile',
    component: ProfileComponent,
    canActivate: [PraserGuard]

  },
  {
    path: 'Feedback',
    component: FeedbackComponent,
    canActivate: [PraserGuard]

  },
  {
    path: 'Confirmation-Message',
    component: ConfirmationMessageComponent,
    canActivate: [PraserGuard]

  },
  {
    path: 'step-one-plandetail/:id',
    component: StepOnePlandetailComponent
  },
  {
    path: 'step-two-budgetdetail/:id',
    component: StepTwoBudgetdetailComponent
  },
  {
    path: 'step-three-goaldetail/:id',
    component: StepThreeGoalsdetailComponent
  },
  {
    path: 'step-three-goaldetail/:id/goal/:goalId',
    component: StepThreeGoalsdetailComponent
  },
  {
    path: 'new-plandetail',
    component: StepOnePlandetailComponent
  },
  {
    path: 'new-budgetdetail/:id',
    component: StepTwoBudgetdetailComponent
  },
  {
    path: 'new-goaldetail/:id',
    component: StepThreeGoalsdetailComponent
  },
  {
    path: 'new-goaldetail/:id/goal/:goalId',
    component: StepThreeGoalsdetailComponent
  },
  {
    path: 'view-plan/:id', component: ViewPlanComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PlanparserRoutingModule { }
