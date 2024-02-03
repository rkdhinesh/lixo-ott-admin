import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoxOfficeUserRoleComponent } from './box-office-user-role.component';
import { EditUserRoleComponent } from './edit-user-role/edit-user-role.component';

const routes: Routes = [
  { path: '', component: BoxOfficeUserRoleComponent },
  { path: 'edit-user-box-office', component: EditUserRoleComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxOfficeUserRoleRoutingModule { }
