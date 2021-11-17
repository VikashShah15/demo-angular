import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailVerifyingComponent } from './Authentication/Pages/email-verifying/email-verifying.component';
import { CommonAuthGuard } from './common-auth.guard';
import { InternalServerErrorComponent } from './Common/internal-server-error/internal-server-error.component';
import { NotFoundErrorComponent } from './Common/not-found-error/not-found-error.component';
import { PrivacyPolicyComponent } from './Common/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './Common/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Layout/layout.module').then(m => m.LayoutModule),
    canActivate: [CommonAuthGuard]
  },
  {
    path: 'authorize',
    loadChildren: () => import('./Authentication/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  { path: '404', component: NotFoundErrorComponent },
  { path: '500', component: InternalServerErrorComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
