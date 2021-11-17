import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPastBookingComponent } from './Pages/my-past-booking/my-past-booking.component';
import { MyUpcomingBookingComponent } from './Pages/my-upcoming-booking/my-upcoming-booking.component';
import { ProviderComponent } from './Pages/provider/provider.component';

const routes: Routes = [
  {
    path: '', component: ProviderComponent,
  },
  {
    path: 'my-upcoming-booking', component: MyUpcomingBookingComponent,
  },
  {
    path: 'my-past-booking', component: MyPastBookingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProviderRoutingModule { }
