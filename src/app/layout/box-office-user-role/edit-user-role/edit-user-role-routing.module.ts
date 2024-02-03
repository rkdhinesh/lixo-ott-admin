import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditUserRoleComponent } from './edit-user-role.component';

const routes: Routes = [
  { path: '', component: EditUserRoleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditUserRoleRoutingModule { }
