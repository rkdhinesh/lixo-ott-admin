import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';
import { EditRoleComponent } from './edit/edit-role.component';

const routes: Routes = [
  { path: '', component: RolesComponent},
  { path: 'edit-role', component: EditRoleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
