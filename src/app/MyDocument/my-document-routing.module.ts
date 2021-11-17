import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentComponent } from './Pages/add-document/add-document.component';
import { ViewDocumentComponent } from './Pages/view-document/view-document.component';
import { DocumentComponent } from './Pages/document/document.component';


const routes: Routes = [
  {
    path: 'add-document', component: AddDocumentComponent,
  },
  {
    path: 'view-document/:documentId', component: ViewDocumentComponent
  },
  {
    path: 'update-document/:documentId', component: AddDocumentComponent
  },
  {
    path: '', component: DocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDocumentRoutingModule { }
