import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleOperationsComponent } from './module-operations.component';
import { EditModuleOperationsComponent } from './edit/edit-module-operations.component';
const routes: Routes = [
  { path: '', component: ModuleOperationsComponent},
  { path: 'edit-module-operations', component: EditModuleOperationsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleOperationsRoutingModule { }
