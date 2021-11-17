import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyExpensesComponent } from './Pages/monthly-expenses/monthly-expenses.component';
const routes: Routes = [
  {
    path: 'monthly-expense', component: MonthlyExpensesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
