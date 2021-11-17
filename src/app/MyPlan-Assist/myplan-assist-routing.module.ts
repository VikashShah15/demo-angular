import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyplanAssistComponent } from './Pages/myplan-assist/myplan-assist.component';

const routes: Routes = [
  {
    path: '', component: MyplanAssistComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MyplanAssistRoutingModule { }
