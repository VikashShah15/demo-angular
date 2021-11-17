import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyExpensesComponent } from './Pages/monthly-expenses/monthly-expenses.component';
import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [MonthlyExpensesComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
