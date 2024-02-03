import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaxComponent } from './view-tax.component';

const routes: Routes = [ { path: '', component: ViewTaxComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTaxRoutingModule { }
