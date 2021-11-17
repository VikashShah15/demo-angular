import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { MyServiceProvidersComponent } from './my-service-providers/my-service-providers.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
  },
  {
    path: 'appointments', component: AppointmentsComponent
  },
  {
    path: 'my-service-provider', component: MyServiceProvidersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
