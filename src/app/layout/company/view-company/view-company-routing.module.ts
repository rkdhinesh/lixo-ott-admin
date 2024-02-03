import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCompanyComponent } from './view-company.component';

const routes: Routes = [
  { path: '', component: ViewCompanyComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCompanyRoutingModule { }
