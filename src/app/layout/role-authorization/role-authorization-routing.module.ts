import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoleAuthorizationComponent } from './edit-role-authorization/edit-role-authorization.component';
import { RoleAuthorizationComponent } from './role-authorization.component';

const routes: Routes = [
  {path:'',component:RoleAuthorizationComponent},
  { path: 'edit-role-authorization', component: EditRoleAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAuthorizationRoutingModule { }
