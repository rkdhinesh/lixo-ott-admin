import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewLocalityComponent } from './view-locality.component';

const routes: Routes = [
  { path: '', component: ViewLocalityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewLocalityRoutingModule { }
