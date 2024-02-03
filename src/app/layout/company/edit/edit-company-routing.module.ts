import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCompanyComponent } from './edit-company.component';
export const routes: Routes = [
    { path: '', component: EditCompanyComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditCompanyRoutingModule { }
