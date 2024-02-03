import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewChargeComponent } from './view-charge.component';

const routes: Routes = [{ path: '', component: ViewChargeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewChargeRoutingModule { }