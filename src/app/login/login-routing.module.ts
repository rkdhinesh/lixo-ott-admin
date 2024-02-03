import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'layout', component: LayoutComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }