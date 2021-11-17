import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AlertComponent } from './alert/alert.component';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommingSoonComponent } from '../Common/comming-soon/comming-soon.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { ValidationSummaryComponent } from '../Common/validation-summary/validation-summary.component';
import { ViewGoalsComponent } from './view-goals/view-goals.component';

@NgModule({
  declarations: [
    AlertComponent,
    ViewGoalsComponent,
    CommingSoonComponent,
    ValidationSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    CheckboxModule,
    ProgressBarModule,
    TooltipModule,
    MessagesModule,
    MessageModule,
    CalendarModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    CheckboxModule,
    ProgressBarModule,
    TooltipModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    AlertComponent,
    ViewGoalsComponent,
    CalendarModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    CommingSoonComponent,
    ValidationSummaryComponent,
    AngularFireModule,
    AngularFirestoreModule
  ],
  providers: [MessageService, ConfirmationService]

})
export class SharedModule { }
