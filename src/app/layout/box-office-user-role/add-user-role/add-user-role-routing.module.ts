import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserRoleComponent } from './add-user-role.component';

const routes: Routes = [
  { path: '', component: AddUserRoleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUserRoleRoutingModule { }
