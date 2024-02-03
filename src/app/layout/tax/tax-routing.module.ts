import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxComponent } from './tax.component';
import { EditTaxComponent } from './edit-tax/edit-tax.component';
import { ViewTaxComponent } from './view-tax/view-tax.component';

const routes: Routes = [
  { path: '', component: TaxComponent},
  { path: 'edit-tax', component: EditTaxComponent},
  { path: 'view-tax', component: ViewTaxComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
