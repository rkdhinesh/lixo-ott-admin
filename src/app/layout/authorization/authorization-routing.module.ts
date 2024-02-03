import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationComponent } from './authorization.component';
import { EditAuthorizationComponent } from './edit-authorization/edit-authorization.component';

const routes: Routes = [
  { path: '', component: AuthorizationComponent},
  { path: 'edit-authorization', component: EditAuthorizationComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
