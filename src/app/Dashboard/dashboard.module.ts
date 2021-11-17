import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { MyServiceProvidersComponent } from './my-service-providers/my-service-providers.component';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardComponent, AppointmentsComponent, MyServiceProvidersComponent],
  imports: [
    AngularSvgIconModule.forRoot(),
    ChartModule,
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
