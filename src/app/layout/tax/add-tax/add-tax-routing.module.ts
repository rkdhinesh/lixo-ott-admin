import { NgModule } from '@angular/core';
import { AddTaxComponent } from './add-tax.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: AddTaxComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTaxRoutingModule { }
