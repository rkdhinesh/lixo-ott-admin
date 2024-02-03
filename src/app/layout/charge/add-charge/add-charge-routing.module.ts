import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddChargeComponent } from './add-charge.component';


const routes: Routes = [
  { path: '', component: AddChargeComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddChargeRoutingModule { }
