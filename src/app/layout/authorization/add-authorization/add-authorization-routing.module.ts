import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAuthorizationComponent } from './add-authorization.component';

const routes: Routes = [
  {path:'',component:AddAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAuthorizationRoutingModule { }
