import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRoleAuthorizationComponent } from './add-role-authorization.component';

const routes: Routes = [
  {path:'',component:AddRoleAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoleAuthorizationRoutingModule { }
