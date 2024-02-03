import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRoleUserComponent } from './add-role-user.component';

const routes: Routes = [
  {path:'',component:AddRoleUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoleUserRoutingModule { }
