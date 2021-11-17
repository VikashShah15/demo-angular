import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [{
    path: 'dashboard',
    loadChildren: () => import('../Dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'planparser',
    loadChildren: () => import('../Planparser/planparser.module').then(m => m.PlanparserModule)
  },
  {
    path: 'serviceprovider',
    loadChildren: () => import('../ServiceProvider/service-provider.module').then(m => m.ServiceProviderModule)
  }, 
  {
    path: 'profile',
    loadChildren: () => import('../Profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'planassist',
    loadChildren: () => import('../MyPlan-Assist/myplan-assist-routing.module').then(m => m.MyplanAssistRoutingModule)
  },
  {
    path: 'my-document',
    loadChildren: () => import('../MyDocument/my-document.module').then(m => m.MyDocumentModule)
  },
  {
    path: 'my-goal',
    loadChildren: () => import('../MyGoals/mygoal.module').then(m => m.MygoalModule)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule { }
