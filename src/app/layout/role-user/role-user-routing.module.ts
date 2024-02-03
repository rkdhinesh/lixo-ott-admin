import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoleUserComponent } from './edit-role-user/edit-role-user.component';
import { RoleUserComponent } from './role-user.component';

const routes: Routes = [
  {path: '', component: RoleUserComponent},
  {path: 'edit-role-user', component: EditRoleUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleUserRoutingModule { }
