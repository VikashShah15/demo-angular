import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { TermsAndConditionsComponent } from './Common/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './Common/privacy-policy/privacy-policy.component';
import { NotFoundErrorComponent } from './Common/not-found-error/not-found-error.component';
import { InternalServerErrorComponent } from './Common/internal-server-error/internal-server-error.component';
import { httpInterceptorProviders } from '.';
import { MyplanAssistComponent } from './MyPlan-Assist/Pages/myplan-assist/myplan-assist.component';
import { SharedModule } from './shared/shared.module';
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';


@NgModule({
  declarations: [
    AppComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    NotFoundErrorComponent,
    InternalServerErrorComponent,
    MyplanAssistComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [MessageService, httpInterceptorProviders, GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
