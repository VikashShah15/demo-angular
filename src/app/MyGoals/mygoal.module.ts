import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrackMyGoalComponent } from './Pages/track-my-goal/track-my-goal.component';
import { FindTrackGoalComponent } from './Pages/find-track-goal/find-track-goal.component';
import { AddGoalComponent } from './Pages/add-goal/add-goal.component';
import { ViewGoalComponent } from './Pages/view-goal/view-goal.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddTrackGoalComponent } from './Pages/add-track-goal/add-track-goal.component';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { MyGoalRoutingModule } from './mygoal-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FindTrackGoalComponent, AddGoalComponent, ViewGoalComponent, TrackMyGoalComponent, AddTrackGoalComponent],
  imports: [
    CommonModule,
    MyGoalRoutingModule,
    SharedModule,
    TableModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    CalendarModule,


  ],
  providers: [ConfirmationService, DialogService, DynamicDialogRef, DynamicDialogConfig]
})
export class MygoalModule { }
