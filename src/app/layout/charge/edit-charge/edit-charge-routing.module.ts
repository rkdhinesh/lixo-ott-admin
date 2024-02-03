import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditChargeComponent } from './edit-charge.component';

const routes: Routes = [{ path: '', component: EditChargeComponent},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditChargeRoutingModule { }
