import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFareComponent } from './view-fare.component';

const routes: Routes = [ { path: '', component: ViewFareComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFareRoutingModule { }
