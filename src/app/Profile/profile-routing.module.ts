import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { ProfileComponent } from './Pages/profile/profile.component';


const routes: Routes = [
  {
    path: 'change-password', component: ChangePasswordComponent
  },
  {
    path: 'profile', component: ProfileComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileRoutingModule { }
