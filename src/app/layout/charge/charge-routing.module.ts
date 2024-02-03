import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChargeComponent } from './charge.component';
import { ViewChargeComponent } from './view-charge/view-charge.component';
import { EditChargeComponent } from './edit-charge/edit-charge.component';


const routes: Routes = [
  { path: '', component: ChargeComponent},
  { path: 'edit-charge', component: EditChargeComponent},
  { path: 'view-charge', component: ViewChargeComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeRoutingModule { }
