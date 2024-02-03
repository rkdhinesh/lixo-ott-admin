import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAuthorizationComponent } from './edit-authorization.component';

const routes: Routes = [
  {path:'',component:EditAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAuthorizationRoutingModule { }
