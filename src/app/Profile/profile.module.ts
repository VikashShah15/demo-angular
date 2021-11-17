import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ChangePasswordComponent, ProfileComponent ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
