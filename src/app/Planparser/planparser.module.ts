import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PrivacyComponent } from './Pages/privacy/privacy.component';
import { PlanFundedComponent } from './Pages/plan-funded/plan-funded.component';
import { PlanFundedGoalsComponent } from './Pages/plan-funded-goals/plan-funded-goals.component';
import { ParserComponent } from './Pages/parser/parser.component';
import { FeedbackComponent } from './Pages/feedback/feedback.component';
import { ConfirmationMessageComponent } from './Pages/confirmation-message/confirmation-message.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { ServiceproviderComponent } from './Pages/serviceprovider/serviceprovider.component';
import { StepOnePlandetailComponent } from './Pages/step-one-plandetail/step-one-plandetail.component';
import { StepTwoBudgetdetailComponent } from './Pages/step-two-budgetdetail/step-two-budgetdetail.component';
import { ViewPlanComponent } from './Pages/view-plan/view-plan.component';
import { StepThreeGoalsdetailComponent } from './Pages/step-three-goalsdetail/step-three-goalsdetail.component';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AsteriskPipe } from './asterisk.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { PlanparserRoutingModule } from './planparser-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PrivacyComponent,
    PlanFundedComponent,
    PlanFundedGoalsComponent,
    ParserComponent,
    FeedbackComponent,
    ConfirmationMessageComponent,
    ProfileComponent,
    ServiceproviderComponent,
    AsteriskPipe,
    StepOnePlandetailComponent,
    StepTwoBudgetdetailComponent,
    ViewPlanComponent,
    StepThreeGoalsdetailComponent
  ],
  imports: [
    CommonModule,
    PlanparserRoutingModule,
    SharedModule,
    HttpClientModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
})
export class PlanparserModule { }
