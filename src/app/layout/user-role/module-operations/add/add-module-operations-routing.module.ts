import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddModuleOperationsComponent } from './add-module-operations.component';
const routes: Routes = [
  { path: '', component: AddModuleOperationsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddModuleOperationsRoutingModule { }
