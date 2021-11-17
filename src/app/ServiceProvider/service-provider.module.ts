import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './Pages/provider/provider.component';
import { MyUpcomingBookingComponent } from './Pages/my-upcoming-booking/my-upcoming-booking.component';
import { MyPastBookingComponent } from './Pages/my-past-booking/my-past-booking.component';
import { ServiceProviderRoutingModule } from './service-provider-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ProviderComponent, MyUpcomingBookingComponent, MyPastBookingComponent],
  imports: [
    CommonModule,
    ServiceProviderRoutingModule,
    SharedModule
  ]
})
export class ServiceProviderModule { }
