import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewRoleAuthorizationComponent } from './view-role-authorization.component';

const routes: Routes = [
  {path:'',component:ViewRoleAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoleAuthorizationRoutingModule { }
