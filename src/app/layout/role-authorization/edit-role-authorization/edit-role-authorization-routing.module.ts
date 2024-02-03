import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoleAuthorizationComponent } from './edit-role-authorization.component';

const routes: Routes = [
  {path:'',component:EditRoleAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoleAuthorizationRoutingModule { }
