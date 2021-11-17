import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDocumentComponent } from './Pages/add-document/add-document.component';
import { DocumentComponent } from './Pages/document/document.component';
import { ViewDocumentComponent } from './Pages/view-document/view-document.component';
import { MyDocumentService } from 'src/app/MyDocument/Service/services/my-document.service';
import { FormatFileSizePipe } from './filesize.pipe';
import { MyDocumentRoutingModule } from './my-document-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AddDocumentComponent, ViewDocumentComponent, DocumentComponent, FormatFileSizePipe],
  imports: [
    CommonModule,
    MyDocumentRoutingModule,
    CalendarModule,
    FileUploadModule,
    SharedModule,
    TableModule,

  ],
  providers: [ MyDocumentService]
})
export class MyDocumentModule { }
