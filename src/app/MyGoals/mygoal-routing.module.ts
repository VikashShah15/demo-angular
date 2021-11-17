import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGoalComponent } from './Pages/add-goal/add-goal.component';
import { ViewGoalComponent } from './Pages/view-goal/view-goal.component';
import { FindTrackGoalComponent } from './Pages/find-track-goal/find-track-goal.component';
import { TrackMyGoalComponent } from './Pages/track-my-goal/track-my-goal.component';
import { AddTrackGoalComponent } from './Pages/add-track-goal/add-track-goal.component';

const routes: Routes = [
  {
    path: 'add-goal', component: AddGoalComponent,
  },
  {
    path: 'find-track-goal', component: FindTrackGoalComponent,
  },
  {
    path: 'view-goal', component: ViewGoalComponent,
  },
  {
    path: 'track-my-goal/:goalId', component: TrackMyGoalComponent
  },
  {
    path: 'add-track-goal/:goalId', component: AddTrackGoalComponent
  },
  {
    path: 'update-track-goal/:goalId/:goalTrackId', component: AddTrackGoalComponent
  },
  {
    path: 'update-goal/:goalId', component: AddGoalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGoalRoutingModule { }
