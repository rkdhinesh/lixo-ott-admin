import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoleUserComponent } from './edit-role-user.component';

const routes: Routes = [
  {path:'',component:EditRoleUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoleUserRoutingModule { }
