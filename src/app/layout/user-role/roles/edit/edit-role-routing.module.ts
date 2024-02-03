import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoleComponent } from './edit-role.component';
export const routes: Routes = [
    { path: '', component: EditRoleComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditRoleRoutingModule { }
