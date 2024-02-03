import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRoleComponent } from './user-role.component';
import { EditUserComponent } from './edit-user/edit-user.component';
const routes: Routes = [
  { path: '', component: UserRoleComponent},
  { path: 'edit-user', component: EditUserComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleRoutingModule { }
