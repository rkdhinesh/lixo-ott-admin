import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditModuleOperationsComponent } from './edit-module-operations.component';
export const routes: Routes = [
    { path: '', component: EditModuleOperationsComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditModuleOperationsRoutingModule { }
